export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId?: string;
  plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE" | "UNPAID";
  billingCycle: "MONTHLY" | "YEARLY";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType:
    | "API_CALL"
    | "LOGIN"
    | "SIGNUP"
    | "SUBSCRIPTION_CREATED"
    | "SUBSCRIPTION_CANCELLED"
    | "CUSTOM";
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AnalyticsStats {
  totalEvents: number;
  eventsToday: number;
  eventsThisMonth: number;
  eventsByType: Record<string, number>;
  dailyEvents: Array<{
    date: string;
    count: number;
  }>;
}

export interface CheckoutSessionRequest {
  priceId: string;
  billingCycle: "MONTHLY" | "YEARLY";
}
