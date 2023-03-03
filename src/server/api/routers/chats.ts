import { getOpenaiClient } from "@/lib/openai";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type ChatCompletionRequestMessageRoleEnum } from "openai";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  getAllChats: publicProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.chat.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { position: "asc" },
          take: 5,
        },
      },
    });
    return chats;
  }),

  getChatById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUnique({
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

  createChat: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.chat.create({
      data: {
        messages: {
          create: [
            {
              text: "You are a helpful assistant.",
              position: 0,
              role: "system",
            },
          ],
        },
      },
    });
  }),
  addToChat: publicProcedure
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

      const messages = chat.messages;

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
                position: messages.length,
                role: "user",
              },
              {
                text: content,
                position: messages.length + 1,
                role: "assistant",
              },
            ],
          },
        },
      });
    }),

  renameChat: publicProcedure
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

  removeChat: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chat.delete({
        where: {
          id: input.id,
        },
      });
    }),

  seedChatFromTemplate: publicProcedure
    .input(z.object({ template: z.string() }))
    .mutation(async ({ ctx, input }) => {
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

      return ctx.prisma.chat.create({
        data: {
          messages: {
            create: [
              {
                text: "You are a helpful assistant.",
                position: 0,
                role: "system",
              },
              {
                text: input.template,
                position: 1,
                role: "user",
              },
              {
                text: content,
                position: 2,
                role: "assistant",
              },
            ],
          },
        },
      });
    }),
});
