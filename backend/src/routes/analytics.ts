import { Router } from "express";
import AnalyticsController from "../controllers/analyticsController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.post("/track", authenticateToken, AnalyticsController.trackEvent);
router.get("/", authenticateToken, AnalyticsController.getUserAnalytics);
router.get("/events", authenticateToken, AnalyticsController.getEventCounts);
router.get("/daily", authenticateToken, AnalyticsController.getDailyAnalytics);
router.get("/top", authenticateToken, AnalyticsController.getTopEvents);
router.get("/summary", authenticateToken, AnalyticsController.getSummary);

export default router;
