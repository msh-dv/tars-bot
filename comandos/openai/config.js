const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configura las caracteristicas del bot."),
  async execute(interaction) {
    const inter = interaction.guild;

    await interaction.reply();
  },
};
