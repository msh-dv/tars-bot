const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Repite lo que le dices.")
    .addStringOption((option) =>
      option
        .setName("mensaje")
        .setDescription("Mensaje a responder.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const mensaje = interaction.options.getString("mensaje");
    await interaction.reply(mensaje);
  },
};
