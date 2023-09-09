import { dalgaRouter } from "~/server/api/routers/dalga";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dalga: dalgaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
