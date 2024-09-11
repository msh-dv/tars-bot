const {
  SlashCommandBuilder,
  ThreadAutoArchiveDuration,
} = require("discord.js");

const { createThread } = require("../../modules/threads/threadsHistory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topic")
    .setDescription(
      "Genera un hilo separado del canal para un tema específico."
    )
    .addStringOption((option) =>
      option
        .setName("nombre")
        .setDescription("Nombre del hilo.")
        .setMaxLength(100)
    ),

  async execute(interaction) {
    const userID = interaction.member.id || "none";
    const userName = interaction.member.displayName || "none";
    const threadName =
      interaction.options.getString("nombre") || `${userName} conversation`;

    try {
      const replyMessage = await interaction.reply({
        content: `Creando un nuevo hilo **${threadName}**...`,
        fetchReply: true,
      });

      const thread = await replyMessage.startThread({
        name: threadName,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        reason: "Nueva conversación",
      });

      createThread(thread.id, thread.name);

      if (thread.joinable) await thread.join();
      await thread.members.add(userID);

      await interaction.editReply(
        `**Nuevo hilo de conversación creado**: ${threadName}.`
      );
    } catch (err) {
      console.error("Error de comando (thread):", err.message);
      await interaction.editReply("> *Hubo un error ejecutando este comando*");
    }
  },
};
