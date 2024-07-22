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
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.deferReply({ ephemeral: true });
    const inte = interaction;
    const mensaje = interaction.options.getString("mensaje");

    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: mensaje }],
      stream: true,
    });

    console.log("Nueva instancia de IA creada");
    const chatCompletion = await stream.finalChatCompletion();
    const finalMessage = chatCompletion.choices[0].message.content;
    await interaction.editReply(`${finalMessage}`);
    console.log(
      `\x1b[1;32mPublic: \x1b[1;34m${inte.user.username}\x1b[0m at ${inte.createdAt}\x1b[0m
      Message: ${mensaje}
      Respones: ${finalMessage} `
    );
  },
};
