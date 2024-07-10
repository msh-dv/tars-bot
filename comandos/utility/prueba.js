const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prueba")
    .setDescription("Muestra informacion del usuario."),
  async execute(interaction) {
    await interaction.reply("```Here!```");
  },
};
