const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modelos")
    .setDescription(
      "Personaliza los modelos por defecto para texto, imagenes y audio."
    ),
  async execute(interaction) {
    const textSelector = new StringSelectMenuBuilder()
      .setCustomId("textModels")
      .setPlaceholder("GPT-4o-mini")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("GPT-4o-mini")
          .setDescription("Modelo más accesible para tareas rápidas y ligeras.")
          .setValue("gpt-4o-mini")
          .setDefault(true),
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
      .setPlaceholder("DALL-E-2")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-2")
          .setDescription(
            "Modelo de generación de imagenes realistas y precisas."
          )
          .setValue("dall-e-2")
          .setDefault(true),
        new StringSelectMenuOptionBuilder()
          .setLabel("DALL-E-3")
          .setDescription(
            "Ultimo modelo de generación de imagenes de DALL-E, imagenes más realistas y mejor resolución."
          )
          .setValue("dall-e-3")
      );
    const audioSelector = new StringSelectMenuBuilder()
      .setCustomId("audioModel")
      .setPlaceholder("TTS-1")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1")
          .setDescription("Modelo de texto a voz, más rápido.")
          .setValue("tts-1")
          .setDefault(true),
        new StringSelectMenuOptionBuilder()
          .setLabel("TTS-1-HD")
          .setDescription("Modelo de texto a voz, mayor calidad de audio.")
          .setValue("tts-1-hd")
      );
    const save = new ButtonBuilder()
      .setCustomId("save")
      .setLabel("Guardar")
      .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancelar")
      .setStyle(ButtonStyle.Secondary);

    const textModel = new ActionRowBuilder().addComponents(textSelector);
    const imageModel = new ActionRowBuilder().addComponents(imageSelector);
    const audioModel = new ActionRowBuilder().addComponents(audioSelector);
    const buttons = new ActionRowBuilder().addComponents(cancel, save);

    await interaction.reply({
      content: "# Modelos por defecto:",
      components: [textModel, imageModel, audioModel, buttons],
      ephemeral: true,
    });
  },
};
