const OpenAI = require("openai");
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

module.exports = {
  //Creamos un comando de slash "/"
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Envia un mensaje a ChatGPT")
    .addStringOption((option) =>
      option
        //Pedimos un mensaje al usuario
        .setName("mensaje")
        .setDescription("Mensaje a enviar.")
        .setMaxLength(4_50)
        .setRequired(true)
    ),
  async execute(interaction) {
    //Ejecutamos la respuesta al mensaje dado
    const inte = interaction;
    //Añadimos deferReply para evitar que la API marque un error por timeout
    interaction.deferReply();
    const mensaje = interaction.options.getString("mensaje");

    //instrucciones predeterminadas
    const instrucciones = `You are TARS, a Discord bot that uses OpenAI models to provide creative and detailed responses on any topic. The user language respons has to be the same that the input`;

    const completion = await openai.chat.completions.create({
      //Agregamos la informacion para hacer la peticion a la API de OpenAI
      messages: [
        {
          role: "system",
          content: instrucciones.trim(),
        },
        { role: "user", content: mensaje },
      ],
      model: "gpt-4o-mini",
      max_tokens: 600,
    });
    //Creamos una variable para almacenar la respuesta completa
    const chatCompletion = completion.choices[0].message.content;

    try {
      if (chatCompletion.length > 2000) {
        const firstPart = chatCompletion.substring(0, 2000);
        const secondPart = chatCompletion.substring(2000);
        await interaction.editReply(`${firstPart}`);
        await interaction.followUp(`${secondPart}`);
      } else {
        await interaction.editReply(`${chatCompletion}`);
      }
    } catch (error) {
      console.error(error);
    }

    //Logs de las interacciones
    console.log(
      `Public: ${inte.user.username} at ${inte.createdAt}
      Message: ${mensaje}
      Response: ${chatCompletion}, Response.length = ${chatCompletion.length}
      Tokens: ${completion.usage.total_tokens}
      `
    );
  },
};
