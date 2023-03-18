import { createTRPCRouter, protectedAdminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const accountsRouter = createTRPCRouter({
  getUsers: protectedAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({});
    return users.filter((x) => x.email !== process.env.ADMIN_EMAIL);
  }),

  createUser: protectedAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.prisma.user.create({
        data: {
          email: input.email,
        },
      });
      return account;
    }),

  removeUser: protectedAdminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
      return settings;
    }),
});
