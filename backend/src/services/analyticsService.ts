import { PrismaClient } from "@prisma/client";
import { AnalyticsEvent } from "../types";

const prisma = new PrismaClient();

class AnalyticsService {
  static async trackEvent(userId: string, event: string, metadata?: any) {
    return await prisma.analytics.create({
      data: {
        userId,
        event,
        metadata,
      },
    });
  }

  static async getUserAnalytics(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const whereClause: any = { userId };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = startDate;
      if (endDate) whereClause.timestamp.lte = endDate;
    }

    const analytics = await prisma.analytics.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
    });

    return analytics;
  }

  static async getEventCounts(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const whereClause: any = { userId };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = startDate;
      if (endDate) whereClause.timestamp.lte = endDate;
    }

    const eventCounts = await prisma.analytics.groupBy({
      by: ["event"],
      where: whereClause,
      _count: {
        event: true,
      },
    });

    return eventCounts.map((item) => ({
      event: item.event,
      count: item._count.event,
    }));
  }

  static async getDailyAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date,
        event,
        COUNT(*) as count
      FROM analytics 
      WHERE "userId" = ${userId}
        AND timestamp >= ${startDate}
      GROUP BY DATE(timestamp), event
      ORDER BY date DESC
    `;

    return analytics;
  }

  static async getTopEvents(userId: string, limit: number = 10) {
    const topEvents = await prisma.analytics.groupBy({
      by: ["event"],
      where: { userId },
      _count: {
        event: true,
      },
      orderBy: {
        _count: {
          event: "desc",
        },
      },
      take: limit,
    });

    return topEvents.map((item) => ({
      event: item.event,
      count: item._count.event,
    }));
  }

  static async getAnalyticsSummary(userId: string) {
    const totalEvents = await prisma.analytics.count({
      where: { userId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEvents = await prisma.analytics.count({
      where: {
        userId,
        timestamp: {
          gte: today,
        },
      },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weekEvents = await prisma.analytics.count({
      where: {
        userId,
        timestamp: {
          gte: lastWeek,
        },
      },
    });

    const uniqueEvents = await prisma.analytics.findMany({
      where: { userId },
      select: { event: true },
      distinct: ["event"],
    });

    return {
      totalEvents,
      todayEvents,
      weekEvents,
      uniqueEventTypes: uniqueEvents.length,
    };
  }
}

export default AnalyticsService;
