import { Interaction } from "discord.js";
import {
  TempVoiceAction,
  tempVoiceCustomId,
} from "../components/tempvoice/customIds.js";
import { handleTempVoiceButton } from "./tempvoice-buttons.js";
import { handleTempVoicePanelCommand } from "../commands/tempvoice-panel.js";

const tempVoiceActionSet = new Set<string>(Object.values(tempVoiceCustomId));

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "tempvoice-panel") {
      await handleTempVoicePanelCommand(interaction);
    }

    return;
  }

  if (!interaction.isButton()) {
    return;
  }

  if (!tempVoiceActionSet.has(interaction.customId)) {
    return;
  }

  await handleTempVoiceButton(interaction, interaction.customId as TempVoiceAction);
}
