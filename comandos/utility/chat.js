const OpenAI = require("openai");
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const openai = new OpenAI();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Envia tu mensaje a ChatGPT4")
    .addStringOption((option) =>
      option
        .setName("mensaje")
        .setDescription("Mensaje a responder.")
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.deferReply();
    const mensaje = interaction.options.getString("mensaje");

    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: mensaje }],
      stream: true,
    });

    console.log("Nueva instancia de IA creada");
    const chatCompletion = await stream.finalChatCompletion();
    await interaction.editReply(`${chatCompletion.choices[0].message.content}`);
  },
};
