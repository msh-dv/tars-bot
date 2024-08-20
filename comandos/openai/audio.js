const audioReq = require("../../modules/openai/audioModel");
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
    try {
      await interaction.deferReply();

      const inte = interaction;
      const mensaje = interaction.options.getString("prompt");
      let model = interaction.options.getString("model") || "tts-1";
      let voice = interaction.options.getString("voice") || "nova";

      const response = await audioReq(
        inte.member.id,
        inte.member.displayName,
        model,
        voice,
        mensaje
      );

      if (response) {
        await interaction.editReply({
          files: [{ attachment: response, name: "audio.mp3" }],
        });

        console.log(`Eliminando: ${response}`);
        fs.promises.unlink(response);
      } else {
        await interaction.editReply(
          `> *Este mensaje inflige nuestras politicas de uso*`
        );
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply(`> *Hubo un erro ejecutando este comando*`);
    }
  },
};
