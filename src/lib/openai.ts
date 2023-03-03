import { prisma } from "@/server/db";
import { Configuration, OpenAIApi } from "openai";

export async function getOpenaiClient() {
  const settings = await prisma.setting.findMany();

  const s = settings[0];

  if (!s?.openaiKey) {
    throw new Error("No settings found");
  }

  const configuration = new Configuration({
    apiKey: s.openaiKey,
  });

  return new OpenAIApi(configuration);
}
