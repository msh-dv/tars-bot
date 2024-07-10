const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Muestra informacion del usuario."),
  async execute(interaction) {
    const roles = interaction.member.roles.cache
      .map((role) => role.name)
      .join(", ");
    await interaction.reply({
      content: `Informacion del usuario: 

      ID: ${interaction.user.id}
      Nombre: ${interaction.user.username}
      Apodo: ${interaction.member.nickname}
      Roles: ${roles}
      Creado en: ${interaction.user.createdAt}`,

      ephemeral: true,
    });
  },
};
