const { SlashCommandBuilder, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modelos")
    .setDescription("Muestra los modelos disponibles."),
  async execute(interaction) {
    const modelInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle("Modelos")
      .setDescription(bold("Lista de modelos disponibles:"))
      .setThumbnail(
        "https://msh-dv.github.io/tars-website/images/tars-profile.png"
      )
      .addFields(
        {
          name: bold("Modelos de texto:"),
          value: codeBlock("gpt-3.5-turbo"),
          value: codeBlock("gpt-4-turbo"),
          value: codeBlock("gpt-4o"),
          value: codeBlock("gpt-4o-mini	"),
        },
        {
          name: bold("Modelos de imagen:"),
          value: codeBlock("Dall-E 3 (Proximamente)"),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [modelInfo] });
  },
};
