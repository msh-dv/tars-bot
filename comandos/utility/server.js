const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion sobre el servidor."),
  async execute(interaction) {
    const i = interaction.guild;
    await interaction.reply(
      `## ${i.name} (${i.id})

      Usuarios: ${i.memberCount}
      Creado desde: ${i.createdAt}
      Id del creador: ${i.ownerId}
      Boosts: ${i.premiumSubscriptionCount}

      `
    );
  },
};
