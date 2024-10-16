import { SlashCommandBuilder, bold } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra informacion del usuario."),
  async execute(interaction) {
    const i = interaction.user;
    const member = interaction.member;
    const roles = member.roles.cache.map((role) => role.name).join(", ");

    const userInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${member.displayName} (${i.username})`)
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
