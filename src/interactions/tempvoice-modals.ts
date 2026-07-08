import {
    ChannelType,
    GuildMember,
    ModalSubmitInteraction,
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

async function handleRenameModal(interaction: ModalSubmitInteraction) {
    const member = await getGuildMember(interaction);

    if (!member) {
        await interaction.reply({
            ephemeral: true,
            content: "서버 안에서만 사용할 수 있는 기능입니다.",
        });
        return;
    }

    const channel = member.voice.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice) {
        await interaction.reply({
            ephemeral: true,
            content: "먼저 이름을 변경할 음성 채널에 들어가 주세요.",
        });
        return;
    }

    if (!tempVoiceService.canManageChannel(member, channel)) {
        await interaction.reply({
            ephemeral: true,
            content: "이 음성 채널을 관리할 수 있는 상태가 아닙니다.",
        });
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

export async function handleTempVoiceModal(interaction: ModalSubmitInteraction) {
    if (interaction.customId === tempVoiceModalCustomId.rename) {
        await handleRenameModal(interaction);
        return true;
    }

    return false;
}