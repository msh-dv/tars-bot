const OpenAI = require("openai");
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
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
    const instrucciones = `
    Instrucciones:
    Eres TARS un bot de discord que usa la API de OpenAI para dar respuestas generadas con IA.
    Tu nombre hace referencia al robot de la pelicula interestelar TARS.
    Longitud de respuestas: medias.
    Tipo de respuestas: formales, detalladas.

    A continuacion, responde al mensaje del usuario:
    `;

    const stream = await openai.beta.chat.completions.stream({
      //Agregamos la informacion para hacer la peticion a la API de OpenAI
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: instrucciones + mensaje }],
      stream: true,
    });
    //Creamos una variable para almacenar la respuesta completa
    const chatCompletion = await stream.finalChatCompletion();
    const finalMessage = chatCompletion.choices[0].message.content;
    //Redirigimos la respuesta y la editamos para añadir nuestra respuesta
    await interaction.editReply(`${finalMessage}`);
    //Logs de las interacciones
    console.log(
      `\x1b[1;32mPublic: \x1b[1;34m${inte.user.username}\x1b[0m at ${inte.createdAt}\x1b[0m
      Message: ${mensaje}
      Response: ${finalMessage} 
      `
    );
  },
};
