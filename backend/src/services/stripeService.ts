import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class StripeService {
  private static stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  static async createCustomer(email: string, name?: string) {
    const customer = await this.stripe.customers.create({
      email,
      name,
    });

    return customer;
  }

  static async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let customerId = user.subscription?.stripeCustomerId;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await this.createCustomer(
        user.email,
        user.name || undefined
      );
      customerId = customer.id;

      // Update subscription with customer ID
      await prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session;
  }

  static async createPortalSession(customerId: string, returnUrl: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  }

  static async handleWebhook(body: any, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "invoice.payment_succeeded":
        await this.handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    const userId = session.metadata?.userId;
    if (!userId) return;

    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: { userId },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        plan: this.mapStripePriceToPlan(subscription.items.data[0].price.id),
        status: "ACTIVE",
      },
    });
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await this.stripe.subscriptions.retrieve(
      invoice.subscription as string
    );

    await prisma.subscription.updateMany({
      where: { stripeCustomerId: invoice.customer as string },
      data: {
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        status: "ACTIVE",
      },
    });
  }

  private static async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ) {
    await prisma.subscription.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        plan: this.mapStripePriceToPlan(subscription.items.data[0].price.id),
        status: subscription.status === "active" ? "ACTIVE" : "CANCELED",
      },
    });
  }

  private static async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ) {
    await prisma.subscription.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        plan: "FREE",
        status: "CANCELED",
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
      },
    });
  }

  private static mapStripePriceToPlan(
    priceId: string
  ): "FREE" | "BASIC" | "PRO" | "ENTERPRISE" {
    // Map your Stripe price IDs to subscription plans
    const priceMap: Record<string, "FREE" | "BASIC" | "PRO" | "ENTERPRISE"> = {
      [process.env.STRIPE_BASIC_PRICE_ID || ""]: "BASIC",
      [process.env.STRIPE_PRO_PRICE_ID || ""]: "PRO",
      [process.env.STRIPE_ENTERPRISE_PRICE_ID || ""]: "ENTERPRISE",
    };

    return priceMap[priceId] || "FREE";
  }
}

export default StripeService;
