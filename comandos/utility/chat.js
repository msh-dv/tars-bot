const OpenAI = require("openai");
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const openai = new OpenAI();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Envia un mensaje a ChatGPT4")
    .addStringOption((option) =>
      option
        .setName("mensaje")
        .setDescription("Mensaje enviar.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const inte = interaction;
    interaction.deferReply();
    const mensaje = interaction.options.getString("mensaje");

    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: mensaje }],
      stream: true,
    });

    console.log(`${inte.user.username}:${mensaje} at ${inte.createdTimestamp}`);
    const chatCompletion = await stream.finalChatCompletion();
    await interaction.editReply(`${chatCompletion.choices[0].message.content}`);
  },
};
