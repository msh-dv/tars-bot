const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const { getUser } = require("../modules/users/usersHistory");
const moderation = require("../modules/moderation/moderation");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";
    const userData = getUser(userID, userName);
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
    } else if (interaction.isStringSelectMenu()) {
      const select = interaction;
      const interactionID = select.customId;
      const interactionValue = select.values;
      //Restriccion de uso
      if (userID != "725826170519552172") {
        await interaction.reply({
          content: `Acceso restringido para testers por ahora.`,
          ephemeral: true,
        });
        return;
      }

      // TODO: Completar el envio de datos
      switch (interactionID) {
        case "textModels":
          await interaction.reply({
            content: `> Actualizando modelo de Texto a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.TextModel = interactionValue;
          break;
        case "imageModel":
          await interaction.reply({
            content: `> Actualizando modelo de Imagenes a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.ImageModel = interactionValue;
          break;
        case "audioModel":
          await interaction.reply({
            content: `> Actualizando modelo de Audio a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.AudioModel = interactionValue;
          break;
        default:
          await interaction.reply({
            content: `> *Dato no valido: **${interactionValue}***`,
            ephemeral: true,
          });
      }
    } else if (interaction.isButton()) {
      const button = interaction;
      if (button.customId == "configModal") {
        const modal = new ModalBuilder()
          .setCustomId("modalInstrucciones")
          .setTitle("Instrucciones");

        // Add components to modal

        const nuevoUsername = new TextInputBuilder()
          .setCustomId("modalUserName")
          .setLabel("Nombre del usuario:")
          .setPlaceholder("e.g Victor Manuel Vicente, Juan.")
          .setRequired(false)
          .setMaxLength(2_0)
          .setStyle(TextInputStyle.Short);

        const nuevasInstrucciones = new TextInputBuilder()
          .setCustomId("modalIntructions")
          .setLabel("Instrucciones estaticas:")
          .setPlaceholder("e.g Te llamas Sara y eres un asistente muy util.")
          .setMaxLength(4_50)
          .setRequired(false)
          .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(
          nuevoUsername
        );
        const secondActionRow = new ActionRowBuilder().addComponents(
          nuevasInstrucciones
        );

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
      } else if (button.customId == "wipeMemory") {
        console.log("Borrando memoria");
        userData.wipeMemory();
        await interaction.reply({
          content: "Memoria del asistente restaurada.",
        // ephemeral: true,
        });
      }
    } else if (interaction.isModalSubmit()) {
      const nuevoUsername =
        interaction.fields.getTextInputValue("modalUserName");
      const nuevasInstrucciones =
        interaction.fields.getTextInputValue("modalIntructions");
      console.log({ nuevoUsername, nuevasInstrucciones });

      const isName = await moderation(nuevoUsername);
      const isInst = await moderation(nuevasInstrucciones);

      if (isName.flagged || isInst.flagged) {
        await interaction.reply({
          content: `> El contenido inflige nuestras politicas de uso.`,
          ephemeral: true,
        });
      }

      // TODO:corregir el orden de name y id

      userData.setNewUsername(nuevoUsername);
      userData.setNewInstructions(nuevasInstrucciones);

      await interaction.reply({
        content: `Se actualizaron los datos del asistente.`,
        // ephemeral: true,
      });
    }
  },
};
