"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Filter } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Analytics() {
  const { stats, loading } = useAnalytics();
  // Mock data - use real stats when available
  const timeRanges = ["Last 7 days", "Last 30 days", "Last 90 days"];

  const eventData = stats
    ? Object.entries(stats.eventsByType).map(([event, count]) => ({
        event,
        count,
        percentage: (count / stats.totalEvents) * 100,
      }))
    : [
        { event: "llm_request", count: 1420, percentage: 45.2 },
        { event: "api_call", count: 892, percentage: 28.4 },
        { event: "dashboard_view", count: 543, percentage: 17.3 },
        { event: "profile_update", count: 187, percentage: 6.0 },
        { event: "subscription_view", count: 98, percentage: 3.1 },
      ];

  const dailyData = stats?.dailyEvents?.map((item) => ({
    date: item.date,
    events: item.count,
  })) || [
    { date: "2025-06-01", events: 234 },
    { date: "2025-06-02", events: 189 },
    { date: "2025-06-03", events: 267 },
    { date: "2025-06-04", events: 298 },
    { date: "2025-06-05", events: 445 },
    { date: "2025-06-06", events: 523 },
    { date: "2025-06-07", events: 384 },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="animate-pulse">Loading analytics...</div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Analytics
              </h1>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="mt-6 flex space-x-2">
              {timeRanges.map((range, index) => (
                <Button
                  key={range}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {range}
                </Button>
              ))}
            </div>

            {/* Event Analytics */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Event Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of events tracked in your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventData.map((item) => (
                      <div
                        key={item.event}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{item.event}</Badge>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[200px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">
                            {item.count.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Event Volume</CardTitle>
                  <CardDescription>
                    Events tracked per day over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground">
                      Line chart placeholder - integrate with recharts
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hourly Distribution</CardTitle>
                  <CardDescription>
                    Average events per hour throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground">
                      Bar chart placeholder - integrate with recharts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown Table */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Breakdown</CardTitle>
                  <CardDescription>
                    Detailed view of events by day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Events
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change from Previous Day
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dailyData.map((day, index) => {
                          const previousDay = dailyData[index - 1];
                          const change = previousDay
                            ? (
                                ((day.events - previousDay.events) /
                                  previousDay.events) *
                                100
                              ).toFixed(1)
                            : null;

                          return (
                            <tr key={day.date}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(day.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.events.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {change ? (
                                  <span
                                    className={`${
                                      parseFloat(change) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {parseFloat(change) >= 0 ? "+" : ""}
                                    {change}%
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
