import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { subscriptions, businessProfiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Input validation schemas
const subscriptionInput = z.object({
  planId: z.string(),
  paymentToken: z.string().optional(),
});

const businessProfileInput = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  description: z.string().min(1),
  useCase: z.string().min(1),
  websiteUrl: z.string().url().optional(),
});

export const onboardingRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(subscriptionInput)
    .mutation(async ({ ctx, input }) => {
      const [subscription] = await ctx.db.insert(subscriptions).values({
        userId: ctx.session.user.id,
        planId: input.planId,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }).returning();

      return subscription;
    }),

  createBusinessProfile: protectedProcedure
    .input(businessProfileInput)
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a business profile
      const existingProfile = await ctx.db.query.businessProfiles.findFirst({
        where: eq(businessProfiles.userId, ctx.session.user.id),
      });

      if (existingProfile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Business profile already exists",
        });
      }

      const [profile] = await ctx.db.insert(businessProfiles).values({
        ...input,
        userId: ctx.session.user.id,
      }).returning();

      return profile;
    }),

  // Get the current onboarding status
  getOnboardingStatus: protectedProcedure
    .query(async ({ ctx }) => {
      const [subscription, businessProfile] = await Promise.all([
        ctx.db.query.subscriptions.findFirst({
          where: eq(subscriptions.userId, ctx.session.user.id),
        }),
        ctx.db.query.businessProfiles.findFirst({
          where: eq(businessProfiles.userId, ctx.session.user.id),
        }),
      ]);

      return {
        hasSubscription: !!subscription,
        hasBusinessProfile: !!businessProfile,
        isComplete: !!subscription && !!businessProfile,
      };
    }),

  // Get the user's subscription details
  getSubscription: protectedProcedure
    .query(async ({ ctx }) => {
      const subscription = await ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, ctx.session.user.id),
      });
      
      return subscription;
    }),
});