import {
  bold,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
  codeBlock,
} from "discord.js";

import userModel from "../../modules/mongo/models/Users.js";
import { getUser } from "../../modules/conversations/conversationsHistory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("models")
    .setDescription(
      "Customize the default models for text, images, and audio."
    ),
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";

    await getUser(userID, userName);

    const userData = await userModel.findOne({ id: userID });

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("User models:")
      .setDescription(`${userName} (${userID})`)
      .setThumbnail(interaction.user.avatarURL())
      .addFields(
        {
          name: bold("Text:"),
          value: codeBlock(`${userData.textModel}`),
        },
        {
          name: bold("Images:"),
          value: codeBlock(`${userData.imageModel}`),
        },
        {
          name: bold("Audio:"),
          value: codeBlock(`${userData.audioModel}`),
        }
      )
      .setTimestamp();

    const textSelector = new StringSelectMenuBuilder()
      .setCustomId("textModels")
      .setPlaceholder("Text model")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4o-mini")
          .setDescription("More accessible model for quick and light tasks.")
          .setValue("gpt-4o-mini"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4o")
          .setDescription("Smarter model, ideal for complex tasks.")
          .setValue("gpt-4o"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4-Turbo")
          .setDescription("The previous smarter model before GPT-4o.")
          .setValue("gpt-4-turbo"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-3.5-Turbo")
          .setDescription("Fast and cost-effective model for simple tasks.")
          .setValue("gpt-3.5-turbo")
      );

    const imageSelector = new StringSelectMenuBuilder()
      .setCustomId("imageModel")
      .setPlaceholder("Image model")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-2")
          .setDescription(
            "Image generation model for realistic and accurate images."
          )
          .setValue("dall-e-2"),
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-3")
          .setDescription(
            "Latest DALL-E image generation model, more realistic images and better resolution."
          )
          .setValue("dall-e-3")
      );
    const audioSelector = new StringSelectMenuBuilder()
      .setCustomId("audioModel")
      .setPlaceholder("Audio model")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1")
          .setDescription("Text-to-speech model, faster.")
          .setValue("tts-1"),
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1-HD")
          .setDescription("Text-to-speech model, higher audio quality.")
          .setValue("tts-1-hd")
      );

    const textModel = new ActionRowBuilder().addComponents(textSelector);
    const imageModel = new ActionRowBuilder().addComponents(imageSelector);
    const audioModel = new ActionRowBuilder().addComponents(audioSelector);

    await interaction.reply({
      content: "## Default models config:",
      embeds: [embed],
      components: [textModel, imageModel, audioModel],
      ephemeral: true,
    });
  },
};
