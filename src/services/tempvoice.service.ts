import {
  GuildMember,
  OverwriteType,
  PermissionFlagsBits,
  VoiceChannel,
} from "discord.js";

export type ChannelClaimResult =
  | "claimed"
  | "already-owner"
  | "owner-present";

export class TempVoiceService {
  canManageChannel(member: GuildMember, channel: VoiceChannel) {
    if (!channel.members.has(member.id)) {
      return false;
    }

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return true;
    }

    const memberOverwrite = channel.permissionOverwrites.cache.get(member.id);

    return (
      memberOverwrite?.allow.has(PermissionFlagsBits.ManageChannels) ?? false
    );
  }

  getChannelOwnerIds(channel: VoiceChannel) {
    return channel.permissionOverwrites.cache
      .filter(
        (overwrite) =>
          overwrite.type === OverwriteType.Member &&
          overwrite.allow.has(PermissionFlagsBits.ManageChannels),
      )
      .map((overwrite) => overwrite.id);
  }

  async assignChannelOwner(channel: VoiceChannel, member: GuildMember) {
    await channel.permissionOverwrites.edit(member, {
      ViewChannel: true,
      Connect: true,
      ManageChannels: true,
    });
  }

  async claimChannel(
    channel: VoiceChannel,
    member: GuildMember,
  ): Promise<ChannelClaimResult> {
    const ownerIds = this.getChannelOwnerIds(channel);

    if (ownerIds.includes(member.id)) {
      return "already-owner";
    }

    const activeOwnerId = ownerIds.find((ownerId) =>
      channel.members.has(ownerId),
    );

    if (activeOwnerId) {
      return "owner-present";
    }

    await Promise.all(
      ownerIds.map((ownerId) =>
        channel.permissionOverwrites.edit(ownerId, {
          ViewChannel: null,
          Connect: null,
          ManageChannels: null,
        }),
      ),
    );

    await this.assignChannelOwner(channel, member);

    return "claimed";
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

  async togglePrivacy(channel: VoiceChannel, member: GuildMember) {
    const everyoneRole = channel.guild.roles.everyone;
    const everyoneOverwrite =
      channel.permissionOverwrites.cache.get(everyoneRole.id);

    const isPrivate =
      everyoneOverwrite?.deny.has(PermissionFlagsBits.Connect) ?? false;

    if (isPrivate) {
      await Promise.all([
        channel.permissionOverwrites.edit(everyoneRole, {
          Connect: null,
        }),
        channel.permissionOverwrites.edit(member, {
          ViewChannel: null,
          Connect: null,
        }),
      ]);

      return false;
    }

    await Promise.all([
      channel.permissionOverwrites.edit(everyoneRole, {
        Connect: false,
      }),
      channel.permissionOverwrites.edit(member, {
        ViewChannel: true,
        Connect: true,
      }),
    ]);

    return true;
  }
}

export const tempVoiceService = new TempVoiceService();