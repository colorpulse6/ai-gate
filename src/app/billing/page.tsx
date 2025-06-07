"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Star, Loader2, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { toast } from "sonner";

export default function Billing() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    subscription,
    loading: _loading,
    createCheckoutSession,
    cancelSubscription,
  } = useSubscription();
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Get current plan info from subscription
  const currentPlan = subscription
    ? {
        name: subscription.plan,
        price:
          subscription.plan === "FREE"
            ? 0
            : subscription.plan === "BASIC"
            ? 29
            : subscription.plan === "PRO"
            ? 99
            : 299,
        billing: subscription.billingCycle.toLowerCase(),
        status: subscription.status.toLowerCase(),
        nextBilling: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
          : null,
      }
    : {
        name: "Free",
        price: 0,
        billing: "monthly",
        status: "active",
        nextBilling: null,
      };

  const handleUpgrade = async (planName: string) => {
    if (!user || actionLoading) return;

    // Map plan names to price IDs (these would be your Stripe price IDs)
    const priceIdMap: { [key: string]: string } = {
      Basic: "price_basic_monthly",
      Pro: "price_pro_monthly",
      Enterprise: "price_enterprise_monthly",
    };

    const priceId = priceIdMap[planName];
    if (!priceId) {
      toast.error("Invalid plan selected");
      return;
    }

    setActionLoading(planName);
    try {
      const url = await createCheckoutSession({
        priceId,
        billingCycle: "MONTHLY",
      });
      if (url) {
        window.location.href = url;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Failed to create checkout session");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || actionLoading) return;

    setActionLoading("cancel");
    try {
      await cancelSubscription();
      toast.success("Subscription cancelled successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setActionLoading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      billing: "forever",
      description: "Perfect for getting started",
      features: [
        "1,000 API requests per month",
        "Basic analytics",
        "Email support",
        "Community access",
      ],
      current: currentPlan.name.toLowerCase() === "free",
    },
    {
      name: "Basic",
      price: 29,
      billing: "monthly",
      description: "Great for small projects",
      features: [
        "10,000 API requests per month",
        "Advanced analytics",
        "Priority email support",
        "Custom integrations",
        "Data export",
      ],
      popular: true,
      current: currentPlan.name.toLowerCase() === "basic",
    },
    {
      name: "Pro",
      price: 99,
      billing: "monthly",
      description: "Perfect for growing businesses",
      features: [
        "100,000 API requests per month",
        "Real-time analytics",
        "Phone & email support",
        "Advanced integrations",
        "Custom webhooks",
        "Team collaboration",
      ],
      current: currentPlan.name.toLowerCase() === "pro",
    },
    {
      name: "Enterprise",
      price: 299,
      billing: "monthly",
      description: "For large scale applications",
      features: [
        "Unlimited API requests",
        "Custom analytics dashboard",
        "Dedicated support manager",
        "White-label solution",
        "SLA guarantee",
        "On-premise deployment",
      ],
      current: currentPlan.name.toLowerCase() === "enterprise",
    },
  ];

  const usageData = {
    apiRequests: {
      used: 245,
      limit: 1000,
      percentage: 24.5,
    },
    storage: {
      used: 1.2,
      limit: 5,
      percentage: 24,
    },
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Billing & Subscription
            </h1>

            {/* Current Plan */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">
                          {currentPlan.name} Plan
                        </h3>
                        <Badge
                          variant={
                            currentPlan.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {currentPlan.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentPlan.price > 0
                          ? `$${currentPlan.price}/${currentPlan.billing}`
                          : "Free forever"}
                      </p>
                      {currentPlan.nextBilling && (
                        <p className="text-sm text-gray-500">
                          Next billing date: {currentPlan.nextBilling}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={actionLoading !== null}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Payment
                      </Button>
                      <Button
                        variant="outline"
                        disabled={actionLoading !== null}
                      >
                        View Invoice History
                      </Button>
                      {subscription && subscription.plan !== "FREE" && (
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === "cancel" ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Current Usage</CardTitle>
                  <CardDescription>
                    Monitor your plan limits and usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Requests</span>
                      <span>
                        {usageData.apiRequests.used.toLocaleString()} /{" "}
                        {usageData.apiRequests.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${usageData.apiRequests.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage</span>
                      <span>
                        {usageData.storage.used} GB / {usageData.storage.limit}{" "}
                        GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${usageData.storage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Plans */}
            <div className="mt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Your Plan
                </h2>
                <p className="mt-2 text-gray-600">
                  Upgrade or downgrade your plan at any time
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative ${
                      plan.popular ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500">/{plan.billing}</span>
                      </div>
                      <CardDescription className="mt-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full"
                        variant={
                          plan.current
                            ? "outline"
                            : plan.popular
                            ? "default"
                            : "outline"
                        }
                        disabled={plan.current || actionLoading !== null}
                        onClick={() =>
                          !plan.current && handleUpgrade(plan.name)
                        }
                      >
                        {actionLoading === plan.name ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : plan.current ? (
                          "Current Plan"
                        ) : (
                          `Upgrade to ${plan.name}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
