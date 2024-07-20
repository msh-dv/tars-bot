const { SlashCommandBuilder, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion sobre el servidor."),
  async execute(interaction) {
    const i = interaction.guild;

    const serverInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${i.name}`)
      .setDescription(bold("Información del servidor:"))
      .setThumbnail(i.iconURL())
      .addFields(
        {
          name: bold("ID"),
          value: `${i.id}`,
        },
        {
          name: bold("Usuarios:"),
          value: `${i.memberCount}`,
        },
        {
          name: bold("Creado desde:"),
          value: `${i.createdAt}`,
        },
        {
          name: bold("ID del creador:"),
          value: `${i.ownerId}`,
        },
        {
          name: bold("Boosts:"),
          value: `${i.premiumSubscriptionCount}`,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [serverInfo] });
  },
};
