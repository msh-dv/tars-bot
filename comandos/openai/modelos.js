const { SlashCommandBuilder, bold, codeBlock } = require("discord.js");
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
        "https://msh-dv.github.io/tars-website/images/profile-picture.png"
      )
      .addFields(
        {
          name: bold("Modelos de texto:"),
          value: codeBlock(
            "gpt-4o-mini(default)\ngpt-3.5-turbo\ngpt-4-turbo\ngpt-4o"
          ),
        },
        {
          name: bold("Modelos de imagen:"),
          value: codeBlock("DALL-E-2\nDALL-E-3"),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [modelInfo] });
  },
};
