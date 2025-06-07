"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, trackEvent, loading } = useAnalytics();

  useEffect(() => {
    // Track dashboard view
    if (user) {
      trackEvent("DASHBOARD_VIEW");
    }
  }, [user, trackEvent]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="animate-pulse">Loading...</div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Use real stats from API or fallback to mock data
  const dashboardStats = stats
    ? {
        totalRequests: stats.totalEvents,
        activeUsers: 89, // This would come from user analytics
        successRate: 98.5, // This would be calculated from error events
        responseTime: 245, // This would come from performance tracking
      }
    : {
        totalRequests: 1250,
        activeUsers: 89,
        successRate: 98.5,
        responseTime: 245,
      };

  const recentActivity = [
    { id: 1, event: "API Request", time: "2 minutes ago", status: "success" },
    { id: 2, event: "User Login", time: "5 minutes ago", status: "success" },
    {
      id: 3,
      event: "Subscription Update",
      time: "12 minutes ago",
      status: "success",
    },
    { id: 4, event: "API Request", time: "15 minutes ago", status: "error" },
    {
      id: 5,
      event: "Dashboard View",
      time: "18 minutes ago",
      status: "success",
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Requests
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.activeUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.successRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0.2% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Response Time
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.responseTime}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    -15ms from last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Over Time</CardTitle>
                  <CardDescription>
                    Daily API requests for the past 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground">
                      Chart placeholder - integrate with recharts
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of different event types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground">
                      Pie chart placeholder - integrate with recharts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest events from your applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Badge
                              variant={
                                activity.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.event}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
