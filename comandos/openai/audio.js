const audioReq = require("../../modules/openai/audioModel");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Convierte tu texto en un audio.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Mensaje a convertir en audio.")
        .setMaxLength(4_50)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("Modelo de audio.")
        .addChoices({ name: "tts-1", value: "tts-1" })
        .addChoices({ name: "tts-1-hd", value: "tts-1-hd" })
    )
    .addStringOption((option) =>
      option
        .setName("voice")
        .setDescription("Voz que genera el audio.")
        .addChoices(
          { name: "alloy", value: "alloy" },
          { name: "echo", value: "echo" },
          { name: "fable", value: "fable" },
          { name: "onyx", value: "onyx" },
          { name: "nova", value: "nova" },
          { name: "shimmer", value: "shimmer" }
        )
    ),
  async execute(interaction) {
    const inte = interaction;
    const mensaje = interaction.options.getString("prompt");
    const userID = inte.member.id;
    const userName = inte.member.displayName;
    let model = interaction.options.getString("model") || "tts-1";
    let voice = interaction.options.getString("voice") || "nova";
    try {
      console.log(`${date}\nAudio: ${userName} ${userID}\nmsg: ${mensaje}`);
      await interaction.deferReply();

      const response = await audioReq(model, voice, mensaje);

      if (response) {
        await interaction.editReply({
          files: [{ attachment: response, name: `audio_${uuidv4()}.mp3` }],
        });

        console.log(`Eliminando: ${response}`);
        fs.promises.unlink(response);
      } else {
        await interaction.editReply(
          `> *Hubo un error ejecutando este comando.*`
        );
      }
    } catch (err) {
      console.error("Error de comando ( audio )", err.message);
      await interaction.editReply(`> *Hubo un erro ejecutando este comando*`);
    }
  },
};
