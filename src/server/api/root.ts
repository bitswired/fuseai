import { chatRouter } from "@/server/api/routers/chats";
import { createTRPCRouter } from "@/server/api/trpc";
import { settingsRouter } from "./routers/settings";
import { templateRouter } from "./routers/templates";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
  settings: settingsRouter,
  templates: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
