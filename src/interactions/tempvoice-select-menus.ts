import {
    ChannelType,
    UserSelectMenuInteraction,
} from "discord.js";
import { tempVoiceService } from "../services/tempvoice.service.js";

export async function handleTempVoiceUserSelect(
    interaction: UserSelectMenuInteraction,
) {
    if (!interaction.inCachedGuild()) {
        await interaction.reply({
            ephemeral: true,
            content: "서버 안에서만 사용할 수 있는 기능입니다.",
        });
        return;
    }

    await interaction.deferUpdate();

    const channel = interaction.member.voice.channel;

    if (!channel || channel.type !== ChannelType.GuildVoice) {
        await interaction.editReply({
            content: "먼저 소유권을 이전할 음성 채널에 들어가 주세요.",
            components: [],
        });
        return;
    }

    if (!tempVoiceService.canManageChannel(interaction.member, channel)) {
        await interaction.editReply({
            content: "이 음성 채널의 소유권을 이전할 권한이 없습니다.",
            components: [],
        });
        return;
    }

    const targetMemberId = interaction.values[0];

    if (!targetMemberId) {
        await interaction.editReply({
            content: "소유권을 이전할 사용자를 확인할 수 없습니다.",
            components: [],
        });
        return;
    }

    const targetMember = await interaction.guild.members
        .fetch(targetMemberId)
        .catch(() => null);

    if (!targetMember) {
        await interaction.editReply({
            content: "선택한 사용자를 서버에서 찾을 수 없습니다.",
            components: [],
        });
        return;
    }

    const result = await tempVoiceService.transferChannelOwner(
        channel,
        interaction.member,
        targetMember,
    );

    if (result === "not-allowed") {
        await interaction.editReply({
            content: "이 음성 채널의 소유권을 이전할 권한이 없습니다.",
            components: [],
        });
        return;
    }

    if (result === "same-member") {
        await interaction.editReply({
            content: "자기 자신에게는 소유권을 이전할 수 없습니다.",
            components: [],
        });
        return;
    }

    if (result === "target-is-bot") {
        await interaction.editReply({
            content: "봇 계정에는 소유권을 이전할 수 없습니다.",
            components: [],
        });
        return;
    }

    if (result === "target-not-in-channel") {
        await interaction.editReply({
            content: "같은 음성 채널에 접속한 사용자에게만 이전할 수 있습니다.",
            components: [],
        });
        return;
    }

    await interaction.editReply({
        content: `${targetMember}님에게 음성 채널 소유권을 이전했습니다.`,
        components: [],
    });
}