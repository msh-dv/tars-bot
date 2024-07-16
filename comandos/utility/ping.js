const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con un Pong!"),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    const latencia = `\nLatencia: ${sent.createdTimestamp - interaction.createdTimestamp}ms`;
    interaction.editReply(
      `Pong! ${latencia}`
    );
  },
};
