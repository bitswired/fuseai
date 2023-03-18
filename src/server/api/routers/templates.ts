import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

const TemplateSchema = z.array(
  z.object({ name: z.string(), prompt: z.string() })
);

export const templateRouter = createTRPCRouter({
  getTemplatesFromRepo: protectedProcedure
    .output(TemplateSchema)
    .query(async ({ ctx }) => {
      const res = await fetch(
        "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv"
      );

      const x = await res.text();

      // parse csv into json with to keys, act and prompt
      const lines = x.split("\n");
      const headers = lines[0]?.split(",");
      if (!headers) {
        throw new Error("No headers found");
      }

      const data: any = lines.slice(1).map((line) => {
        const values = line.split(",");
        const head = headers.reduce<Record<string, string>>(
          (obj, header, i) => {
            const h = header.replaceAll('"', "");
            const val = values[i]?.replaceAll('"', "");
            if (!val) {
              throw new Error("No value found");
            }
            obj[h] = val;
            return obj;
          },
          {}
        );
        head.name = head.act!;
        return head;
      });

      return TemplateSchema.parse(data);
    }),

  getTemplates: protectedProcedure.query(async ({ ctx, input }) => {
    return ctx.prisma.template.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  upsertTemplate: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.template.upsert({
        where: { id: input.id ?? -1 },
        create: {
          name: input.name,
          prompt: input.prompt,
          User: { connect: { id: ctx.session.user.id } },
        },
        update: {
          name: input.name,
          prompt: input.prompt,
        },
      });
      return res;
    }),

  removeTemplate: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.template.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
