//Comando para crear hilos en canales con temas especificos sin necesidad de usar prefijos/comandos para
//llamar al modulo de generacion de texto

// const textReq = require("../../modules/openai/textModel");
// const imageVision = require("../../modules/openai/imageVision");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topic")
    .setDescription(
      "Genera un hilo separado del canal para un tema especifico."
    )
    .addStringOption((option) =>
      option.setName("nombre").setDescription("Nombre del hilo.")
    ),

  async execute(interaction) {
    // const mensaje = interaction.options.getString("mensaje");
    // const userName = interaction.member.displayName || "anon";
    // const userID = interaction.member.id || "none";
    // const date = interaction.createdAt;

    try {
    } catch (err) {
      console.error("Error de comando (thread):", err.message);
      await interaction.editReply(`> *Hubo un error ejecutando este comando*`);
    }
  },
};
