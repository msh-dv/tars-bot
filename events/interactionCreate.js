import {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import userModel from "../modules/mongo/models/Users.js";
import { getUser } from "../modules/conversations/conversationsHistory.js";
import moderation from "../modules/moderation/moderation.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";
    const userData = await userModel.findOne({ id: userID });
    const mapData = await getUser(userID, userName);

    if (!userData.guilds.includes(interaction.guild)) {
      userData.guilds.push({
        guild: interaction.guild.id,
        name: interaction.guild.name,
      });
      await userData.save();
    }

    const { cooldowns } = interaction.client;

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `Ningun comando ${interaction.commandName} fue encontrado.`
        );
        return;
      }
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Map());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const defaultCooldownDuration = 1;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            content: `¡Debes esperar ${timeLeft.toFixed(
              1
            )} segundos antes de usar este comando de nuevo!`,
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

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
    } else if (interaction.isStringSelectMenu()) {
      const select = interaction;
      const interactionID = select.customId;
      const interactionValue = select.values[0];

      switch (interactionID) {
        case "textModels":
          await interaction.reply({
            content: `> Actualizando modelo de Texto a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.textModel = interactionValue;
          break;
        case "imageModel":
          if (interactionValue == "dall-e-3") {
            await interaction.reply({
              content: `> Only premium users can use DALL-E-3 model.`,
              ephemeral: true,
            });
            break;
          }
          await interaction.reply({
            content: `> Actualizando modelo de Imagenes a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.imageModel = interactionValue;
          break;
        case "audioModel":
          await interaction.reply({
            content: `> Actualizando modelo de Audio a: **${interactionValue}**`,
            ephemeral: true,
          });
          userData.audioModel = interactionValue;
          break;
        default:
          await interaction.reply({
            content: `> *Dato no valido: **${interactionValue}***`,
            ephemeral: true,
          });
      }
      await userData.save();
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
          .setPlaceholder("e.g Te llamas TARS y eres un asistente muy util.")
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
        mapData.wipeMemory();
        userData.dynamicHistory = [];
        userData.instructions = mapData.instrucciones;
        userData.save();
        await interaction.reply({
          content: "Memoria del asistente restaurada.",
          ephemeral: true,
        });
      }
    } else if (interaction.isModalSubmit()) {
      let nuevoUsername = interaction.fields.getTextInputValue("modalUserName");
      let nuevasInstrucciones =
        interaction.fields.getTextInputValue("modalIntructions");

      if (!nuevoUsername.trim()) {
        nuevoUsername = `${userName}`;
      }
      if (!nuevasInstrucciones.trim()) {
        nuevasInstrucciones = `${userData.instructions}`;
      }
      const isName = await moderation(nuevoUsername);
      const isInst = await moderation(nuevasInstrucciones);

      if (isName.flagged || isInst.flagged) {
        await interaction.reply({
          content: `> El contenido inflige nuestras politicas de uso.`,
          ephemeral: true,
        });
      }

      mapData.setNewUsername(nuevoUsername);
      mapData.setNewInstructions(nuevasInstrucciones);

      userData.name = nuevoUsername;
      userData.instructions = nuevasInstrucciones;

      userData.save();

      await interaction.reply({
        content: `Se actualizaron los datos del asistente.`,
        ephemeral: true,
      });
    }
  },
};
