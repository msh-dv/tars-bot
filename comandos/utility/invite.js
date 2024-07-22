const { SlashCommandBuilder, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Muestra un link para invitar al bot a tu servidor."),
  async execute(interaction) {
    const inviteBody = new EmbedBuilder()
      .setColor("White")
      .setTitle()
      .setDescription()
      .setThumbnail()
      .addFields({
        name: "Link de invitacion",
        value:
          "Haz click [aqui](https://discord.com/oauth2/authorize?client_id=1260411192640409600&permissions=28445502074103&integration_type=0&scope=bot+applications.commands)",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [inviteBody] });
  },
};
