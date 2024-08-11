const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Muestra un link para invitar al bot a tu servidor."),
  async execute(interaction) {
    const inviteBody = new EmbedBuilder()
      .setColor("White")
      .setTitle("Link de invitacion")
      .setDescription(
        "[Haz click para invitarme a tu servidor.](https://discord.com/oauth2/authorize?client_id=1260411192640409600&permissions=1129183410388032&integration_type=0&scope=bot+applications.commands)"
      )
      .setTimestamp();

    await interaction.reply({ embeds: [inviteBody] });
  },
};
