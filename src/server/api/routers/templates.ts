import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const templateRouter = createTRPCRouter({
  getTemplatesFromRepo: publicProcedure
    .output(z.array(z.object({ act: z.string(), prompt: z.string() })))
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
        return headers.reduce<Record<string, string>>((obj, header, i) => {
          const h = header.replaceAll('"', "");
          const val = values[i]?.replaceAll('"', "");
          if (!val) {
            throw new Error("No value found");
          }
          obj[h] = val;
          return obj;
        }, {});
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    }),
});
