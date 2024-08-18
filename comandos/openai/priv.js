const textReq = require("../../modules/openai/textModel");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  //Creamos un comando de slash "/"
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
    try {
      await interaction.deferReply({ ephemeral: true });

      const inte = interaction;
      const mensaje = interaction.options.getString("mensaje");

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
    } catch (err) {
      console.error(err);
    }
  },
};
