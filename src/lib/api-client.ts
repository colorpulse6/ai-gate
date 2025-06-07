import {
  ApiResponse,
  User,
  LoginRequest,
  RegisterRequest,
  Subscription,
  AnalyticsEvent,
  AnalyticsStats,
  CheckoutSessionRequest,
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for JWT auth
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "An error occurred",
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Authentication endpoints
  async login(
    credentials: LoginRequest
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request("/api/auth/me");
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request("/api/users/profile");
  }

  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteUserAccount(): Promise<ApiResponse<void>> {
    return this.request("/api/users/account", {
      method: "DELETE",
    });
  }

  // Subscription endpoints
  async getUserSubscription(): Promise<ApiResponse<Subscription>> {
    return this.request("/api/subscriptions");
  }

  async createCheckoutSession(
    request: CheckoutSessionRequest
  ): Promise<ApiResponse<{ url: string }>> {
    return this.request("/api/subscriptions/checkout", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async cancelSubscription(): Promise<ApiResponse<Subscription>> {
    return this.request("/api/subscriptions/cancel", {
      method: "POST",
    });
  }

  // Analytics endpoints
  async trackEvent(
    eventType: string,
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<AnalyticsEvent>> {
    return this.request("/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({ eventType, metadata }),
    });
  }

  async getAnalyticsStats(): Promise<ApiResponse<AnalyticsStats>> {
    return this.request("/api/analytics/stats");
  }

  async getUsageData(): Promise<ApiResponse<AnalyticsEvent[]>> {
    return this.request("/api/analytics/usage");
  }
}

export const apiClient = new ApiClient();
export default apiClient;
