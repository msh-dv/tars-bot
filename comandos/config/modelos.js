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
      "Personaliza los modelos por defecto para texto, imagenes y audio."
    ),
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";

    await getUser(userID, userName);

    const userData = await userModel.findOne({ id: userID });

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Modelos del usuario:")
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
      .setPlaceholder("Texto")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4o-mini")
          .setDescription("Modelo más accesible para tareas rápidas y ligeras.")
          .setValue("gpt-4o-mini"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4o")
          .setDescription(
            "Modelo más inteligente, ideal para tareas complejas."
          )
          .setValue("gpt-4o"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4-Turbo")
          .setDescription("Modelo más inteligente anterior a GPT-4o.")
          .setValue("gpt-4-turbo"),
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-3.5-Turbo")
          .setDescription("Modelo rápido y económico para tareas sencillas.")
          .setValue("gpt-3.5-turbo")
      );

    const imageSelector = new StringSelectMenuBuilder()
      .setCustomId("imageModel")
      .setPlaceholder("Imagenes")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-2")
          .setDescription(
            "Modelo de generación de imagenes realistas y precisas."
          )
          .setValue("dall-e-2"),
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-3")
          .setDescription(
            "Ultimo modelo de generación de imagenes de DALL-E, imagenes más realistas y mejor resolución."
          )
          .setValue("dall-e-3")
      );
    const audioSelector = new StringSelectMenuBuilder()
      .setCustomId("audioModel")
      .setPlaceholder("Audio")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1")
          .setDescription("Modelo de texto a voz, más rápido.")
          .setValue("tts-1"),
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1-HD")
          .setDescription("Modelo de texto a voz, mayor calidad de audio.")
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
