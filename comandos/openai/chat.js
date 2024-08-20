const textReq = require("../../modules/openai/textModel");
const imageVision = require("../../modules/openai/imageVision");
const { SlashCommandBuilder } = require("discord.js");

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
    )
    .addAttachmentOption((option) =>
      option.setName("imagen").setDescription("Imagen a analizar")
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const inte = interaction;
      const mensaje = interaction.options.getString("mensaje");
      const imagen = interaction.options.getAttachment("imagen");

      console.log(imagen.url);

      if (imagen) {
        const imgResponse = await imageVision(
          inte.member.id,
          inte.member.displayName,
          mensaje,
          imagen.url
        );

        await interaction.editReply(`${imgResponse}`);
      } else {
        const response = await textReq(
          inte.member.id,
          inte.member.displayName,
          mensaje
        );

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
      console.error(err);
      await interaction.editReply(`> *Hubo un erro ejecutando este comando*`);
    }
  },
};
