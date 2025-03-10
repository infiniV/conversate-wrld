import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { botContexts, businessProfiles, sessions } from "~/server/db/schema";

interface SystemStatus {
  name: string;
  status: "operational" | "warning";
  latency?: string;
  message?: string;
}

export const dashboardRouter = createTRPCRouter({
  getDashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get business profile
    const business = await ctx.db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId),
    });

    if (!business) throw new Error("Business profile not found");

    // Get total bot contexts
    const totalContextsResult = await ctx.db
      .select({ count: count() })
      .from(botContexts)
      .where(eq(botContexts.businessId, business.id));

    const totalContexts = totalContextsResult[0]?.count ?? 0;

    // Get active sessions in last 24h
    const activeSessionsResult = await ctx.db
      .select({ count: count() })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          gte(sessions.expires, sql`NOW() - INTERVAL '24 hours'`)
        )
      );

    const totalSessions = activeSessionsResult[0]?.count ?? 0;

    // Get system status
    const systemStatus: SystemStatus[] = [
      {
        name: "Agent Server",
        status: "operational",
        latency: "24ms",
      },
      {
        name: "Communication Server",
        status: "operational",
        latency: "31ms",
      },
      {
        name: "Voice Integration",
        status: totalContexts > 0 ? "operational" : "warning",
        message: totalContexts === 0 ? "No contexts configured" : undefined,
        latency: totalContexts > 0 ? "45ms" : undefined,
      },
    ];

    return {
      business: {
        name: business.businessName,
        industry: business.industry,
      },
      metrics: {
        conversations: {
          total: totalSessions,
          increase: 12.5, // This would need real calculation
          chart: [45, 60, 75, 65, 80, 95, 85], // This would need real data
        },
        contexts: {
          total: totalContexts,
          // You would calculate these from real data
          avgResponseTime: {
            current: "1.8s",
            improvement: 15.3,
            chart: [2.5, 2.2, 2.0, 1.9, 1.8, 1.8, 1.7],
          },
        },
        satisfaction: {
          current: 94.7, // This would need real calculation
          increase: 3.2,
          chart: [90, 91, 92, 93, 94, 94.7, 94.5],
        },
      },
      systemStatus,
    };
  }),
});