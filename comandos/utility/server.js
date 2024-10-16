import { SlashCommandBuilder, bold } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion sobre el servidor."),
  async execute(interaction) {
    const inter = interaction.guild;

    const serverInfo = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${inter.name}`)
      .setDescription(bold("Información del servidor:"))
      .setThumbnail(inter.iconURL())
      .addFields(
        {
          name: bold("ID"),
          value: `${inter.id}`,
        },
        {
          name: bold("Usuarios:"),
          value: `${inter.memberCount}`,
        },
        {
          name: bold("Creado desde:"),
          value: `${inter.createdAt}`,
        },
        {
          name: bold("ID del creador:"),
          value: `${inter.ownerId}`,
        },
        {
          name: bold("Boosts:"),
          value: `${inter.premiumSubscriptionCount}`,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [serverInfo] });
  },
};
