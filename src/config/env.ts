import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required."),
  CLIENT_ID: z.string().min(1, "CLIENT_ID is required."),
  GUILD_ID: z.string().min(1, "GUILD_ID is required."),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues.map((issue) => {
    const key = issue.path.join(".");
    return `${key}: ${issue.message}`;
  });

  throw new Error(`Invalid environment variables:\n${messages.join("\n")}`);
}

export const env = parsedEnv.data;