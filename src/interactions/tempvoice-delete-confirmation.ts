import {
    ButtonInteraction,
    ChannelType,
} from "discord.js";
import {
    TempVoiceDeleteAction,
} from "../components/tempvoice/customIds.js";
import { tempVoiceService } from "../services/tempvoice.service.js";

export async function handleTempVoiceDeleteConfirmation(
    interaction: ButtonInteraction,
    action: TempVoiceDeleteAction,
    channelId: string,
) {
    if (!interaction.inCachedGuild()) {
        await interaction.update({
            content: "서버 안에서만 사용할 수 있는 기능입니다.",
            components: [],
        });
        return;
    }

    if (action === "cancel") {
        await interaction.update({
            content: "음성 채널 삭제를 취소했습니다.",
            components: [],
        });
        return;
    }

    const channel = await interaction.guild.channels
        .fetch(channelId)
        .catch(() => null);

    if (!channel || channel.type !== ChannelType.GuildVoice) {
        await interaction.update({
            content: "삭제할 음성 채널을 찾을 수 없습니다.",
            components: [],
        });
        return;
    }

    if (interaction.member.voice.channelId !== channel.id) {
        await interaction.update({
            content: "삭제할 음성 채널에 접속한 상태에서 다시 시도해 주세요.",
            components: [],
        });
        return;
    }

    if (!tempVoiceService.canManageChannel(interaction.member, channel)) {
        await interaction.update({
            content: "이 음성 채널을 삭제할 권한이 없습니다.",
            components: [],
        });
        return;
    }

    await interaction.update({
        content: "음성 채널을 삭제하는 중입니다.",
        components: [],
    });

    await tempVoiceService.deleteChannel(channel);

    await interaction.editReply({
        content: "음성 채널을 삭제했습니다.",
        components: [],
    });
}