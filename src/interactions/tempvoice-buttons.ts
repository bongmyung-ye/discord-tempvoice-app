import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  TempVoiceAction,
  tempVoiceActionLabels,
  tempVoiceCustomId,
  tempVoiceModalCustomId,
  tempVoiceTextInputCustomId,
} from "../components/tempvoice/customIds.js";

function createRenameChannelModal() {
  const channelNameInput = new TextInputBuilder()
    .setCustomId(tempVoiceTextInputCustomId.channelName)
    .setLabel("New channel name")
    .setPlaceholder("Enter a new voice channel name")
    .setMinLength(1)
    .setMaxLength(100)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  return new ModalBuilder()
    .setCustomId(tempVoiceModalCustomId.rename)
    .setTitle("Rename voice channel")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(channelNameInput),
    );
}

export async function handleTempVoiceButton(
  interaction: ButtonInteraction,
  action: TempVoiceAction,
) {
  if (action === tempVoiceCustomId.rename) {
    await interaction.showModal(createRenameChannelModal());
    return;
  }

  const label = tempVoiceActionLabels[action];

  await interaction.reply({
    ephemeral: true,
    content: `\`${label}\` 기능은 다음 작업에서 연결할 예정입니다.`,
  });
}