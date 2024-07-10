const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hi")
    .setDescription("Saluda.:)"),
  async execute(interaction) {
    await interaction.reply(`Hola, ${interaction.user.username}! ;)`);
  },
};

