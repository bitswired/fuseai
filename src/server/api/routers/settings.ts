import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.setting.findMany({});

    return settings[0];
  }),

  upsertSettings: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        openaiKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.prisma.setting.upsert({
        where: {
          id: input.id ?? -1,
        },
        create: {
          openaiKey: input.openaiKey,
        },
        update: {
          openaiKey: input.openaiKey,
        },
      });
      return settings;
    }),
});
