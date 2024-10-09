import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  bold,
} from "discord.js";

import { getUser } from "../../modules/conversations/conversationsHistory.js";
import userModel from "../../modules/mongo/models/Users.js";

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription(
      "Configura las instrucciones del bot y el nombre de usuario."
    ),
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";

    await getUser(userID, userName);
    const userData = await userModel.findOne({ id: userID });
    let embedInstructions = "";
    const instrucciones = userData.instructions;
    const defaultInstructions =
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.";

    if (instrucciones == defaultInstructions) {
      embedInstructions = "You are TARS, a Discord bot designed to provide...";
    } else {
      embedInstructions = instrucciones;
    }

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Configuration")
      .setDescription(`${userName} (${userID})`)
      .setThumbnail(interaction.user.avatarURL())
      .addFields(
        {
          name: bold("Username:"),
          value: `${userData.name}`,
        },
        {
          name: bold("Instructions:"),
          value: `${embedInstructions}`,
        },
        {
          name: bold("Tokens:"),
          value: `${userData.tokens}`,
        }
      )
      .setTimestamp();

    const config = new ButtonBuilder()
      .setCustomId("configModal")
      .setLabel("Configure")
      .setStyle(ButtonStyle.Secondary);
    const wipe = new ButtonBuilder()
      .setCustomId("wipeMemory")
      .setLabel("Wipe Memory")
      .setStyle(ButtonStyle.Danger);

    const configModal = new ActionRowBuilder().addComponents(config, wipe);

    await interaction.reply({
      embeds: [embed],
      components: [configModal],
      ephemeral: true,
    });
  },
};
