import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { tempVoiceCustomId } from "./customIds.js";

const buttonRows = [
  [
    ["✏️", "Name", tempVoiceCustomId.rename],
    ["👥", "Limit", tempVoiceCustomId.limit],
    ["🛡️", "Privacy", tempVoiceCustomId.privacy],
    ["🌙", "Waiting Room", tempVoiceCustomId.waitingRoom],
    ["💬", "Chat", tempVoiceCustomId.chat],
  ],
  [
    ["🧑‍🤝‍🧑", "Trust", tempVoiceCustomId.trust],
    ["🚫", "Untrust", tempVoiceCustomId.untrust],
    ["📨", "Invite", tempVoiceCustomId.invite],
    ["👢", "Kick", tempVoiceCustomId.kick],
    ["🌐", "Region", tempVoiceCustomId.region],
  ],
  [
    ["⛔", "Block", tempVoiceCustomId.block],
    ["✅", "Unblock", tempVoiceCustomId.unblock],
    ["👑", "Claim", tempVoiceCustomId.claim],
    ["🔁", "Transfer", tempVoiceCustomId.transfer],
    ["🗑️", "Delete", tempVoiceCustomId.delete],
  ],
] as const;

export function createTempVoicePanelEmbed() {
  return new EmbedBuilder()
    .setColor(0xff4f8b)
    .setTitle("TempVoice Interface")
    .setDescription(
      [
        "This interface can be used to manage temporary voice channels.",
        "More options are available with slash commands.",
        "",
        "`✏️ Name` `👥 Limit` `🛡️ Privacy` `🌙 Waiting Room` `💬 Chat`",
        "`🧑‍🤝‍🧑 Trust` `🚫 Untrust` `📨 Invite` `👢 Kick` `🌐 Region`",
        "`⛔ Block` `✅ Unblock` `👑 Claim` `🔁 Transfer` `🗑️ Delete`",
      ].join("\n"),
    );
}

export function createTempVoicePanelRows() {
  return buttonRows.map((row) =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      row.map(([emoji, label, customId]) =>
        new ButtonBuilder()
          .setCustomId(customId)
          .setEmoji(emoji)
          .setLabel(label)
          .setStyle(label === "Delete" ? ButtonStyle.Danger : ButtonStyle.Secondary),
      ),
    ),
  );
}
