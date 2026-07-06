import { GuildMember, VoiceChannel } from "discord.js";

export class TempVoiceService {
  canManageChannel(member: GuildMember, channel: VoiceChannel) {
    return channel.members.has(member.id);
  }

  async renameChannel(channel: VoiceChannel, name: string) {
    const normalizedName = name.trim().slice(0, 100);

    if (!normalizedName) {
      throw new Error("Channel name cannot be empty.");
    }

    await channel.setName(normalizedName);
  }

  async setUserLimit(channel: VoiceChannel, limit: number) {
    const safeLimit = Math.max(0, Math.min(limit, 99));
    await channel.setUserLimit(safeLimit);
  }
}

export const tempVoiceService = new TempVoiceService();
