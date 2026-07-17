import { Interaction } from "discord.js";
import {
  parseTempVoiceDeleteCustomId,
  TempVoiceAction,
  tempVoiceCustomId,
  tempVoiceSelectMenuCustomId,
} from "../components/tempvoice/customIds.js";
import { handleTempVoicePanelCommand } from "../commands/tempvoice-panel.js";
import { handleTempVoiceButton } from "./tempvoice-buttons.js";
import { handleTempVoiceDeleteConfirmation } from "./tempvoice-delete-confirmation.js";
import { handleTempVoiceModal } from "./tempvoice-modals.js";
import { handleTempVoiceUserSelect } from "./tempvoice-select-menus.js";

const tempVoiceActionSet = new Set<string>(Object.values(tempVoiceCustomId));

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "tempvoice-panel") {
      await handleTempVoicePanelCommand(interaction);
    }

    return;
  }

  if (interaction.isButton()) {
    const deleteConfirmation = parseTempVoiceDeleteCustomId(
      interaction.customId,
    );

    if (deleteConfirmation) {
      await handleTempVoiceDeleteConfirmation(
        interaction,
        deleteConfirmation.action,
        deleteConfirmation.channelId,
      );
      return;
    }

    if (!tempVoiceActionSet.has(interaction.customId)) {
      return;
    }

    await handleTempVoiceButton(
      interaction,
      interaction.customId as TempVoiceAction,
    );
    return;
  }

  if (interaction.isModalSubmit()) {
    await handleTempVoiceModal(interaction);
    return;
  }

  if (interaction.isUserSelectMenu()) {
    if (interaction.customId !== tempVoiceSelectMenuCustomId.transferOwner) {
      return;
    }

    await handleTempVoiceUserSelect(interaction);
  }
}