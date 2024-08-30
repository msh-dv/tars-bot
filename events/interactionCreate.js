const { Events } = require("discord.js");
const { getUser } = require("../modules/users/usersHistory");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Revisar si la interaccion es un comando
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
      // Revisar si la interaccion es un elemento de seleccion multiple
    } else if (interaction.isStringSelectMenu) {
      const userName = interaction.member.displayName || "anon";
      const userID = interaction.member.id || "none";
      const userData = getUser(userName, userID);
      const select = interaction;
      const interactionID = select.customId;
      const interactionValue = select.values;

      // TODO: Completar el envio de datos
      switch (interactionID) {
        case "textModels":
          await interaction.reply({
            content: `Actualizando modelo de texto a: ${interactionValue}`,
            ephemeral: true,
          });
          userData.TextModel = interactionValue;
          break;
        case "imageModel":
          await interaction.reply({
            content: `Actualizando modelo de imagenes a: ${interactionValue}`,
            ephemeral: true,
          });
          userData.ImageModel = interactionValue;
          break;
        case "audioModel":
          await interaction.reply({
            content: `Actualizando modelo de audio a: ${interactionValue}`,
            ephemeral: true,
          });
          userData.AudioModel = interactionValue;
          break;
        default:
          await interaction.reply({
            content: `ID no valido: ${interactionValue}`,
            ephemeral: true,
          });
      }
    }
  },
};
