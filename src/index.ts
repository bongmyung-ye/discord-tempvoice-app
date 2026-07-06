import { Client, GatewayIntentBits } from "discord.js";
import { env } from "./config/env.js";
import { handleInteraction } from "./interactions/handleInteraction.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    await handleInteraction(interaction);
  } catch (error) {
    console.error(error);

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

await client.login(env.DISCORD_TOKEN);
