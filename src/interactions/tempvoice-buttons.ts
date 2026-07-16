import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
} from "discord.js";
import {
  TempVoiceAction,
  tempVoiceActionLabels,
  tempVoiceCustomId,
  tempVoiceModalCustomId,
  tempVoiceSelectMenuCustomId,
  tempVoiceTextInputCustomId,
} from "../components/tempvoice/customIds.js";
import { tempVoiceService } from "../services/tempvoice.service.js";

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

function createOwnerTransferRow() {
  const userSelectMenu = new UserSelectMenuBuilder()
    .setCustomId(tempVoiceSelectMenuCustomId.transferOwner)
    .setPlaceholder("소유권을 이전할 사용자를 선택해 주세요.")
    .setMinValues(1)
    .setMaxValues(1);

  return new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
    userSelectMenu,
  );
}

async function getCurrentVoiceChannel(interaction: ButtonInteraction) {
  if (!interaction.inCachedGuild()) {
    await interaction.reply({
      ephemeral: true,
      content: "서버 안에서만 사용할 수 있는 기능입니다.",
    });
    return null;
  }

  const channel = interaction.member.voice.channel;

  if (!channel || channel.type !== ChannelType.GuildVoice) {
    await interaction.reply({
      ephemeral: true,
      content: "먼저 관리할 음성 채널에 들어가 주세요.",
    });
    return null;
  }

  return {
    member: interaction.member,
    channel,
  };
}

async function getManageableVoiceChannel(interaction: ButtonInteraction) {
  const context = await getCurrentVoiceChannel(interaction);

  if (!context) {
    return null;
  }

  if (!tempVoiceService.canManageChannel(context.member, context.channel)) {
    await interaction.reply({
      ephemeral: true,
      content: "이 음성 채널을 관리할 권한이 없습니다.",
    });
    return null;
  }

  return context;
}

async function handlePrivacyToggle(interaction: ButtonInteraction) {
  const context = await getManageableVoiceChannel(interaction);

  if (!context) {
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  const isPrivate = await tempVoiceService.togglePrivacy(
    context.channel,
    context.member,
  );

  await interaction.editReply({
    content: isPrivate
      ? "음성 채널을 비공개로 전환했습니다."
      : "음성 채널을 다시 공개했습니다.",
  });
}

async function handleChannelClaim(interaction: ButtonInteraction) {
  const context = await getCurrentVoiceChannel(interaction);

  if (!context) {
    return;
  }

  await interaction.deferReply({
    ephemeral: true,
  });

  const result = await tempVoiceService.claimChannel(
    context.channel,
    context.member,
  );

  if (result === "already-owner") {
    await interaction.editReply({
      content: "이미 이 음성 채널의 소유자입니다.",
    });
    return;
  }

  if (result === "owner-present") {
    await interaction.editReply({
      content: "현재 소유자가 음성 채널에 있어 소유권을 가져올 수 없습니다.",
    });
    return;
  }

  await interaction.editReply({
    content: "이 음성 채널의 소유권을 가져왔습니다.",
  });
}

async function handleOwnerTransfer(interaction: ButtonInteraction) {
  const context = await getManageableVoiceChannel(interaction);

  if (!context) {
    return;
  }

  const transferableMembers = context.channel.members.filter(
    (member) => member.id !== context.member.id && !member.user.bot,
  );

  if (transferableMembers.size === 0) {
    await interaction.reply({
      ephemeral: true,
      content: "현재 음성 채널에 소유권을 이전할 사용자가 없습니다.",
    });
    return;
  }

  await interaction.reply({
    ephemeral: true,
    content: "소유권을 이전할 사용자를 선택해 주세요.",
    components: [createOwnerTransferRow()],
  });
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

  if (action === tempVoiceCustomId.privacy) {
    await handlePrivacyToggle(interaction);
    return;
  }

  if (action === tempVoiceCustomId.claim) {
    await handleChannelClaim(interaction);
    return;
  }

  if (action === tempVoiceCustomId.transfer) {
    await handleOwnerTransfer(interaction);
    return;
  }

  const label = tempVoiceActionLabels[action];

  await interaction.reply({
    ephemeral: true,
    content: `\`${label}\` 기능은 아직 사용할 수 없습니다.`,
  });
}