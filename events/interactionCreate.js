const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `Ningun comando ${interaction.commandName} fue encontrado.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: `Hubo un error ejecutando este comando! ${interaction.commandName}`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `Hubo un error ejecutando este comando! ${interaction.commandName}`,
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton) {
      const button = interaction;
      await interaction.reply({
        content: `Id: ${button.customId}`,
        ephemeral: true,
      });
    }
  },
};
