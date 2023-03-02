import { chatRouter } from "@/server/api/routers/chat";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
