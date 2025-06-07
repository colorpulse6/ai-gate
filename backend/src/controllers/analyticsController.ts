import { Response } from "express";
import AnalyticsService from "../services/analyticsService";
import { AuthenticatedRequest } from "../types";

class AnalyticsController {
  static async trackEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const { event, metadata } = req.body;
      const userId = req.user!.id;

      if (!event) {
        return res.status(400).json({ error: "Event name is required" });
      }

      const result = await AnalyticsService.trackEvent(userId, event, metadata);

      res.status(201).json({
        message: "Event tracked successfully",
        analytics: result,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const analytics = await AnalyticsService.getUserAnalytics(
        userId,
        start,
        end
      );

      res.json({ analytics });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEventCounts(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const eventCounts = await AnalyticsService.getEventCounts(
        userId,
        start,
        end
      );

      res.json({ eventCounts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailyAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { days } = req.query;

      const dailyAnalytics = await AnalyticsService.getDailyAnalytics(
        userId,
        days ? Number(days) : undefined
      );

      res.json({ dailyAnalytics });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopEvents(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { limit } = req.query;

      const topEvents = await AnalyticsService.getTopEvents(
        userId,
        limit ? Number(limit) : undefined
      );

      res.json({ topEvents });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const summary = await AnalyticsService.getAnalyticsSummary(userId);

      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AnalyticsController;
