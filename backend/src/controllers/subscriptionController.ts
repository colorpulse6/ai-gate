import { Response } from "express";
import StripeService from "../services/stripeService";
import { AuthenticatedRequest } from "../types";

class SubscriptionController {
  static async createCheckoutSession(req: AuthenticatedRequest, res: Response) {
    try {
      const { priceId } = req.body;
      const userId = req.user!.id;

      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const successUrl = `${frontendUrl}/dashboard?success=true`;
      const cancelUrl = `${frontendUrl}/pricing?canceled=true`;

      const session = await StripeService.createCheckoutSession(
        userId,
        priceId,
        successUrl,
        cancelUrl
      );

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createPortalSession(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;

      if (!user.subscription?.stripeCustomerId) {
        return res.status(400).json({ error: "No subscription found" });
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const returnUrl = `${frontendUrl}/dashboard`;

      const session = await StripeService.createPortalSession(
        user.subscription.stripeCustomerId,
        returnUrl
      );

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async webhook(req: any, res: Response) {
    try {
      const signature = req.headers["stripe-signature"];

      if (!signature) {
        return res.status(400).json({ error: "Missing Stripe signature" });
      }

      await StripeService.handleWebhook(req.body, signature);

      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;

      res.json({
        subscription: user.subscription,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default SubscriptionController;
