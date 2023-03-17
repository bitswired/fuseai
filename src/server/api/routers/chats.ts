import { replaceTemplate } from "@/features/template";
import { getOpenaiClient } from "@/lib/openai";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type PrismaClient } from "@prisma/client";
import { type ChatCompletionRequestMessageRoleEnum } from "openai";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  getAllChats: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.chat.findMany({
      orderBy: { updatedAt: "desc" },
      where: { userId: ctx.session.user.id },
      include: {
        messages: {
          orderBy: { position: "asc" },
          take: 5,
        },
      },
    });
    return chats;
  }),

  getChatById: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          messages: {
            orderBy: { position: "asc" },
          },
        },
      });

      return chat;
    }),

  createChat: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.chat.create({
      data: {
        User: { connect: { id: ctx.session.user.id } },
        messages: {
          create: [
            {
              text: "You are a helpful assistant.",
              position: 0,
              role: "system",
              User: { connect: { id: ctx.session.user.id } },
            },
          ],
        },
      },
    });
  }),

  addToChat: protectedProcedure
    .input(z.object({ id: z.number().int(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          messages: {
            orderBy: { position: "asc" },
          },
        },
      });

      const totalMessageLength = chat.messages.length;
      const messages = chat.messages.slice(
        totalMessageLength > 10 ? -10 : totalMessageLength * -1
      );

      const openai = await getOpenaiClient();

      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
          .map((m) => ({
            role: m.role as ChatCompletionRequestMessageRoleEnum,
            content: m.text,
          }))
          .concat({
            role: "user",
            content: input.message,
          }),
      });

      const x = res.data?.choices?.[0];

      if (!x?.message?.content) {
        throw new Error("No response from OpenAI");
      }

      const {
        message: { content },
      } = x;

      await ctx.prisma.chat.update({
        where: {
          id: input.id,
        },
        data: {
          messages: {
            create: [
              {
                text: input.message,
                position: totalMessageLength,
                role: "user",
                User: { connect: { id: ctx.session.user.id } },
              },
              {
                text: content,
                position: totalMessageLength + 1,
                role: "assistant",
                User: { connect: { id: ctx.session.user.id } },
              },
            ],
          },
        },
      });
    }),

  renameChat: protectedProcedure
    .input(z.object({ id: z.number().int(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.chat.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });

      return chat;
    }),

  removeChat: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chat.delete({
        where: {
          id: input.id,
        },
      });
    }),

  seedChatFromTemplate: protectedProcedure
    .input(z.object({ template: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await newFunction(input, ctx.prisma, ctx.session.user.id);
    }),

  smartSeedChatFromTemplate: protectedProcedure
    .input(
      z.object({ template: z.string(), variables: z.object({}).passthrough() })
    )
    .mutation(async ({ ctx, input }) => {
      const a = replaceTemplate(input.template, input.variables);

      return newFunction({ template: a }, ctx.prisma, ctx.session.user.id);
    }),
});

async function newFunction(
  input: { template: string },
  prisma: PrismaClient,
  id: string
) {
  const openai = await getOpenaiClient();

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        content: "You are a helpful assistant.",
        role: "system",
      },
      {
        content: input.template,
        role: "user",
      },
    ],
  });

  const x = res.data?.choices?.[0];

  if (!x?.message?.content) {
    throw new Error("No response from OpenAI");
  }

  const {
    message: { content },
  } = x;

  return prisma.chat.create({
    data: {
      User: { connect: { id } },
      messages: {
        create: [
          {
            text: "You are a helpful assistant.",
            position: 0,
            role: "system",
            User: { connect: { id } },
          },
          {
            text: input.template,
            position: 1,
            role: "user",
            User: { connect: { id } },
          },
          {
            text: content,
            position: 2,
            role: "assistant",
            User: { connect: { id } },
          },
        ],
      },
    },
  });
}
