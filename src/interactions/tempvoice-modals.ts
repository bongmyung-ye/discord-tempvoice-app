import {
    ChannelType,
    GuildMember,
    ModalSubmitInteraction,
    VoiceChannel,
} from "discord.js";
import {
    tempVoiceModalCustomId,
    tempVoiceTextInputCustomId,
} from "../components/tempvoice/customIds.js";
import { tempVoiceService } from "../services/tempvoice.service.js";

async function getGuildMember(interaction: ModalSubmitInteraction) {
    if (!interaction.guild) {
        return null;
    }

    if (interaction.member instanceof GuildMember) {
        return interaction.member;
    }

    return interaction.guild.members.fetch(interaction.user.id);
}

async function getManageableVoiceChannel(
    interaction: ModalSubmitInteraction,
): Promise<VoiceChannel | null> {
    const member = await getGuildMember(interaction);

    if (!member) {
        await interaction.reply({
            ephemeral: true,
            content: "서버 안에서만 사용할 수 있는 기능입니다.",
        });
        return null;
    }

    const channel = member.voice.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice) {
        await interaction.reply({
            ephemeral: true,
            content: "먼저 관리할 음성 채널에 들어가 주세요.",
        });
        return null;
    }

    if (!tempVoiceService.canManageChannel(member, channel)) {
        await interaction.reply({
            ephemeral: true,
            content: "이 음성 채널을 관리할 권한이 없습니다.",
        });
        return null;
    }

    return channel;
}

async function handleRenameModal(interaction: ModalSubmitInteraction) {
    const channel = await getManageableVoiceChannel(interaction);

    if (!channel) {
        return;
    }

    const channelName = interaction.fields
        .getTextInputValue(tempVoiceTextInputCustomId.channelName)
        .trim();

    if (!channelName) {
        await interaction.reply({
            ephemeral: true,
            content: "채널 이름은 비워둘 수 없습니다.",
        });
        return;
    }

    await tempVoiceService.renameChannel(channel, channelName);

    await interaction.reply({
        ephemeral: true,
        content: `음성 채널 이름을 \`${channelName}\`(으)로 변경했습니다.`,
    });
}

async function handleUserLimitModal(interaction: ModalSubmitInteraction) {
    const channel = await getManageableVoiceChannel(interaction);

    if (!channel) {
        return;
    }

    const rawLimit = interaction.fields
        .getTextInputValue(tempVoiceTextInputCustomId.userLimit)
        .trim();

    if (!/^\d{1,2}$/.test(rawLimit)) {
        await interaction.reply({
            ephemeral: true,
            content: "인원 제한은 0부터 99까지의 숫자로 입력해 주세요.",
        });
        return;
    }

    const limit = Number(rawLimit);

    await tempVoiceService.setUserLimit(channel, limit);

    await interaction.reply({
        ephemeral: true,
        content:
            limit === 0
                ? "음성 채널 인원 제한을 해제했습니다."
                : `음성 채널 인원 제한을 ${limit}명으로 설정했습니다.`,
    });
}

export async function handleTempVoiceModal(
    interaction: ModalSubmitInteraction,
) {
    if (interaction.customId === tempVoiceModalCustomId.rename) {
        await handleRenameModal(interaction);
        return true;
    }

    if (interaction.customId === tempVoiceModalCustomId.limit) {
        await handleUserLimitModal(interaction);
        return true;
    }

    return false;
}