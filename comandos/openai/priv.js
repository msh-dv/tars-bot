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
    //Ejecutamos la respuesta al mensaje dado
    const inte = interaction;
    //Añadimos deferReply para evitar que la API marque un error por timeout
    interaction.deferReply({ ephemeral: true });
    const mensaje = interaction.options.getString("mensaje");

    //instrucciones predeterminadas
    const instrucciones = `Eres TARS, un bot de discord que usa los modelos de OpenAI para dar respuestas creativas y detalladas de cualquier tema. The user's language should be the same as the language of the user's input. Recuerda saludar con el nombre del usuario, el cual es ${inte.member.displayName}.`;

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
      `Private: ${inte.user.username} at ${inte.createdAt}
      Response.length = ${chatCompletion.length}
      Tokens: ${completion.usage.total_tokens}
      `
    );
  },
};
