"use client";

import { useState, useEffect } from "react";
import { Subscription, CheckoutSessionRequest } from "../types/api";
import { apiClient } from "../lib/api-client";

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUserSubscription();

      if (response.success && response.data) {
        setSubscription(response.data);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load subscription"
      );
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (
    request: CheckoutSessionRequest
  ): Promise<string | null> => {
    try {
      setError(null);
      const response = await apiClient.createCheckoutSession(request);

      if (response.success && response.data) {
        return response.data.url;
      } else {
        setError(response.error || "Failed to create checkout session");
        return null;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create checkout session"
      );
      return null;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setError(null);
      const response = await apiClient.cancelSubscription();

      if (response.success && response.data) {
        setSubscription(response.data);
        return true;
      } else {
        setError(response.error || "Failed to cancel subscription");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
      return false;
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refreshSubscription,
    createCheckoutSession,
    cancelSubscription,
  };
}
