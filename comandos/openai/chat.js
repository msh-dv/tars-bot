//Comando para llamadas al modelo de texto, incluyendo una imagen opcional

const textReq = require("../../modules/openai/textModel");
const imageVision = require("../../modules/openai/imageVision");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Envia un mensaje a ChatGPT")
    .addStringOption((option) =>
      option
        .setName("mensaje")
        .setDescription("Mensaje a enviar.")
        .setMaxLength(4_50)
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option.setName("imagen").setDescription("Imagen a analizar")
    ),

  async execute(interaction) {
    const mensaje = interaction.options.getString("mensaje");
    const imagen = interaction.options.getAttachment("imagen") || false;
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";
    const date = interaction.createdAt;

    try {
      console.log(
        `${date}\nPublico (chat): ${userName} ${userID}\nmsg: ${mensaje}`
      );
      await interaction.deferReply();
      //Validando si se ha enviado una imagen

      if (imagen) {
        console.log("Tipo:Imagen adjunta");
        const imgResponse = await imageVision(
          userID,
          userName,
          mensaje,
          imagen.url
        );

        await interaction.editReply(`${imgResponse}`);
      } else {
        const response = await textReq(userID, userName, mensaje);

        //Validando si se envio una respuesta y dividiendola si se pasa de 2000
        //caracteres (limite de discord)

        if (response) {
          if (response.length > 2000) {
            const firstPart = response.substring(0, 2000);
            const secondPart = response.substring(2000);
            await interaction.editReply(`${firstPart}`);
            await interaction.followUp(`${secondPart}`);
          } else {
            await interaction.editReply(`${response}`);
          }
        } else {
          await interaction.editReply(`> *This message violates our usage policies.* 
      > *Este mensaje inflige nuestras politicas de uso.*`);
        }
      }
    } catch (err) {
      console.error("Error de comando:", err.message);
      await interaction.editReply(`> *Hubo un error ejecutando este comando*`);
    }
  },
};
