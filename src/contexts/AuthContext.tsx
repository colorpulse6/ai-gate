"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, LoginRequest, RegisterRequest } from "../types/api";
import { apiClient } from "../lib/api-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || "Login failed");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || "Registration failed");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.updateUserProfile(data);

      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.error || "Profile update failed");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
