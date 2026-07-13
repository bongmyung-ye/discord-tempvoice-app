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
    .setLabel("새 채널 이름")
    .setPlaceholder("변경할 음성 채널 이름을 입력해 주세요.")
    .setMinLength(1)
    .setMaxLength(100)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  return new ModalBuilder()
    .setCustomId(tempVoiceModalCustomId.rename)
    .setTitle("음성 채널 이름 변경")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(channelNameInput),
    );
}

function createUserLimitModal() {
  const userLimitInput = new TextInputBuilder()
    .setCustomId(tempVoiceTextInputCustomId.userLimit)
    .setLabel("인원 제한")
    .setPlaceholder("0부터 99까지 입력해 주세요. 0은 제한 없음입니다.")
    .setMinLength(1)
    .setMaxLength(2)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  return new ModalBuilder()
    .setCustomId(tempVoiceModalCustomId.limit)
    .setTitle("음성 채널 인원 제한 설정")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(userLimitInput),
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

  if (action === tempVoiceCustomId.limit) {
    await interaction.showModal(createUserLimitModal());
    return;
  }

  const label = tempVoiceActionLabels[action];

  await interaction.reply({
    ephemeral: true,
    content: `\`${label}\` 기능은 아직 사용할 수 없습니다.`,
  });
}