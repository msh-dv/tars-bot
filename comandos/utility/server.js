const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion sobre el servidor."),
  async execute(interaction) {
    const i = interaction.guild;

    const serverInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${i.name} (${i.id})`)
      .setDescription(bold("Información del servidor:"))
      .setThumbnail(
        "https://msh-dv.github.io/tars-website/images/tars-profile.png"
      )
      .addFields(
        {
          name: bold("Usuarios:"),
          value: `${i.memberCount}`,
        },
        {
          name: bold("Creado desde:"),
          value: `${i.createdAt}`,
        },
        {
          name: bold("ID del servidor:"),
          value: `${i.ownerId}`,
        },
        {
          name: bold("Boosts:"),
          value: codeBlock(`${i.premiumSubscriptionCount}`),
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [serverInfo] });
  },
};
