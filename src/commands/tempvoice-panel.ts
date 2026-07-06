import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import {
  createTempVoicePanelEmbed,
  createTempVoicePanelRows,
} from "../components/tempvoice/panel.js";

export const tempVoicePanelCommand = new SlashCommandBuilder()
  .setName("tempvoice-panel")
  .setDescription("TempVoice 관리 패널을 전송합니다.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function handleTempVoicePanelCommand(
  interaction: ChatInputCommandInteraction,
) {
  await interaction.reply({
    embeds: [createTempVoicePanelEmbed()],
    components: createTempVoicePanelRows(),
  });
}
