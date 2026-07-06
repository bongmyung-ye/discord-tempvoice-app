import { REST, Routes } from "discord.js";
import { env } from "./config/env.js";
import { tempVoicePanelCommand } from "./commands/tempvoice-panel.js";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
  body: [tempVoicePanelCommand.toJSON()],
});

console.log("Registered guild commands.");
