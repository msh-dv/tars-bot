const { SlashCommandBuilder, codeBlock, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra informacion de ayuda."),
  async execute(interaction) {
    const exampleEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Comandos")
      .setDescription(bold("Información sobre comandos:"))
      .setThumbnail(
        "https://msh-dv.github.io/tars-website/images/profile-picture.png"
      )
      .addFields(
        {
          name: bold("/help"),
          value: codeBlock("Muestra este mensaje de ayuda."),
        },
        {
          name: bold("/chat"),
          value: codeBlock("Envia un mensaje a ChatGPT."),
        },
        {
          name: bold("/priv"),
          value: codeBlock("Envia un mensaje privado a ChatGPT."),
        },
        {
          name: bold("/modelos"),
          value: codeBlock("Muestra los modelos disponibles."),
        },
        {
          name: bold("/server"),
          value: codeBlock("Muestra información del servidor."),
        },
        {
          name: bold("/info"),
          value: codeBlock("Muestra información del usuario."),
        },
        {
          name: bold("/invite"),
          value: codeBlock("Link de invitacion para el bot."),
        },
        { name: bold("/hi"), value: codeBlock("Responde con un Hola!") },
        { name: bold("/echo"), value: codeBlock("Repite lo que le digas.") },
        { name: bold("/ping"), value: codeBlock("Responde con un Pong!") }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
