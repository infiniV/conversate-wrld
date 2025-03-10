import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { livekitRouter } from "~/server/api/routers/livekit";
import { onboardingRouter } from "~/server/api/routers/onboarding";
import { dashboardRouter } from "~/server/api/routers/dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  livekit: livekitRouter,
  onboarding: onboardingRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
