const OpenAI = require("openai");
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const openai = new OpenAI();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("priv")
    .setDescription("Envia un mensaje privado a ChatGPT")
    .addStringOption((option) =>
      option
        .setName("mensaje")
        .setDescription("Mensaje a enviar.")
        .setMaxLength(4_50)
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.deferReply({ ephemeral: true });
    const inte = interaction;

    const instrucciones = `
    Instrucciones:
    Eres TARS un bot de discord que usa la API de OpenAI para dar respuestas generadas con IA.
    Tu nombre hace referencia al robot de la pelicula interestelar TARS.
    Nombre del usuario:${inte.member.nickname}.
    Longitud de respuestas: medias.
    Tipo de respuestas: formales, detalladas.

    A continuacion, responde al mensaje del usuario:
    `;
    const mensaje = interaction.options.getString("mensaje");

    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: instrucciones + mensaje }],
      stream: true,
    });

    const chatCompletion = await stream.finalChatCompletion();
    const finalMessage = chatCompletion.choices[0].message.content;
    await interaction.editReply(`${finalMessage}`);
    console.log(
      `\x1b[1;31mPrivate: \x1b[1;34m${inte.user.username}\x1b[0m at ${inte.createdAt}\x1b[0m
      Message: ${mensaje}
      Response: ${finalMessage} `
    );
  },
};
