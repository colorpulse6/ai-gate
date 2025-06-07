import { Router } from "express";
import SubscriptionController from "../controllers/subscriptionController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Protected routes
router.get("/", authenticateToken, SubscriptionController.getSubscription);
router.post(
  "/checkout",
  authenticateToken,
  SubscriptionController.createCheckoutSession
);
router.post(
  "/portal",
  authenticateToken,
  SubscriptionController.createPortalSession
);

// Webhook route (no auth required)
router.post("/webhook", SubscriptionController.webhook);

export default router;
