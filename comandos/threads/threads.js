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
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("modelo")
        .setDescription("Modelo de texto (incluye analisis de imagenes).")
        .addChoices(
          { name: "GPT-4o-mini", value: "gpt-4o-mini" },
          { name: "GPT-4o", value: "gpt-4o" }
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const userID = interaction.member.id || "none";
    const userName = interaction.member.displayName || "none";
    const threadModel =
      interaction.options.getString("modelo") || "gpt-4o-mini";
    const threadName =
      interaction.options.getString("nombre") || `${userName} | ${threadModel}`;

    if (threadModel == "gpt-4o") {
      await interaction.reply({
        content: `Esta opcion solo esta disponible para usuarios premium.`,
        ephemeral: true,
      });
      return;
    }

    try {
      const replyMessage = await interaction.reply({
        content: `Nuevo hilo de conversación creado: **${threadName}**, para enviar un mensaje sin que lo lea el bot, usa ;;antes del mensaje`,
        fetchReply: true,
      });

      const thread = await replyMessage.startThread({
        name: threadName,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        reason: "Nueva conversación",
      });
      console.log(`Nuevo hilo creado: ${threadName}`);

      createThread(thread.id, thread.name);

      if (thread.joinable) await thread.join();
      await thread.members.add(userID);
    } catch (err) {
      console.error("Error de comando (thread):", err.message);
      await interaction.editReply("> *Hubo un error ejecutando este comando*");
    }
  },
};
