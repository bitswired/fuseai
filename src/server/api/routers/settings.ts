import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.setting.findMany({
      where: { userId: ctx.session.user.id },
    });

    return settings[0];
  }),

  upsertSettings: protectedProcedure
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
          User: { connect: { id: ctx.session.user.id } },
        },
        update: {
          openaiKey: input.openaiKey,
        },
      });
      return settings;
    }),
});
