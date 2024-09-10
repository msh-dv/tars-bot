//Comando para crear hilos en canales con temas especificos sin necesidad de usar prefijos/comandos para
//llamar al modulo de generacion de texto

// const textReq = require("../../modules/openai/textModel");
// const imageVision = require("../../modules/openai/imageVision");
const {
  SlashCommandBuilder,
  ThreadAutoArchiveDuration,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topic")
    .setDescription(
      "Genera un hilo separado del canal para un tema especifico."
    )
    .addStringOption((option) =>
      option
        .setName("nombre")
        .setDescription("Nombre del hilo.")
        .setMaxLength(1_00)
    ),

  async execute(interaction) {
    const userID = interaction.member.id || "none";
    // const date = interaction.createdAt;

    const threadName = interaction.options.getString("nombre");
    const thread = await interaction.channel.threads.create({
      name: `${threadName}`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
      reason: "Hilo del bot",
    });

    const threadToJoin = interaction.channel.threads.cache.find(
      (x) => x.name === `${threadName}`
    );
    if (threadToJoin.joinable) await thread.join();
    await thread.members.add(`${userID}`);

    console.log(`Created thread: ${thread.name}`);
    await interaction.reply(`Nueva conversacion creada ${threadName}`);

    try {
    } catch (err) {
      console.error("Error de comando (thread):", err.message);
      await interaction.editReply(`> *Hubo un error ejecutando este comando*`);
    }
  },
};
