const { SlashCommandBuilder, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra informacion del usuario."),
  async execute(interaction) {
    const i = interaction.user;
    const member = interaction.member;
    const roles = member.roles.cache.map((role) => role.name).join(", ");

    const userInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${member.nickname} (${i.username})`)
      .setDescription("Información del usuario:")
      .setThumbnail(i.avatarURL())
      .addFields(
        {
          name: bold("ID"),
          value: `${i.id}`,
        },
        {
          name: bold("Creado desde:"),
          value: `${i.createdAt}`,
        },
        {
          name: bold("Roles:"),
          value: `${roles}`,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [userInfo], ephemeral: true });
  },
};
