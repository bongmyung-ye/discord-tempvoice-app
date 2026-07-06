import { ButtonInteraction } from "discord.js";
import {
  TempVoiceAction,
  tempVoiceActionLabels,
} from "../components/tempvoice/customIds.js";

export async function handleTempVoiceButton(
  interaction: ButtonInteraction,
  action: TempVoiceAction,
) {
  const label = tempVoiceActionLabels[action];

  await interaction.reply({
    ephemeral: true,
    content: `\`${label}\` 기능은 다음 작업에서 연결할 예정입니다.`,
  });
}
