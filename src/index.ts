import { Client, GatewayIntentBits } from "discord.js";
import { env } from "./config/env.js";
import { handleInteraction } from "./interactions/handleInteraction.js";
import { logger } from "./utils/logger.js";

function createClient() {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMembers,
    ],
  });
}

async function bootstrap() {
  const client = createClient();

  client.once("ready", (readyClient) => {
    logger.info(`Logged in as ${readyClient.user.tag}`);
    logger.info(`Serving ${readyClient.guilds.cache.size} guild(s).`);
  });

  client.on("interactionCreate", async (interaction) => {
    try {
      await handleInteraction(interaction);
    } catch (error) {
      logger.error("Failed to handle interaction.", error);

      if (!interaction.isRepliable()) {
        return;
      }

      const payload = {
        ephemeral: true,
        content: "요청을 처리하는 중 문제가 발생했습니다.",
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(payload);
        return;
      }

      await interaction.reply(payload);
    }
  });

  process.on("unhandledRejection", (error) => {
    logger.error("Unhandled promise rejection.", error);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception.", error);
  });

  await client.login(env.DISCORD_TOKEN);
}

await bootstrap();