"use client";

import { useState, useEffect } from "react";
import { AnalyticsStats, AnalyticsEvent } from "../types/api";
import { apiClient } from "../lib/api-client";

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAnalyticsStats();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to load analytics stats");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load analytics stats"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    try {
      const response = await apiClient.getUsageData();

      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setError(response.error || "Failed to load usage data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load usage data"
      );
    }
  };

  const trackEvent = async (
    eventType: string,
    metadata?: Record<string, unknown>
  ): Promise<boolean> => {
    try {
      const response = await apiClient.trackEvent(eventType, metadata);

      if (response.success) {
        // Refresh stats and events after tracking
        await Promise.all([refreshStats(), refreshEvents()]);
        return true;
      } else {
        setError(response.error || "Failed to track event");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track event");
      return false;
    }
  };

  useEffect(() => {
    refreshStats();
    refreshEvents();
  }, []);

  return {
    stats,
    events,
    loading,
    error,
    refreshStats,
    refreshEvents,
    trackEvent,
  };
}
