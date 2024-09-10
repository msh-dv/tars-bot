const textReq = require("../modules/openai/textModel");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    const { content, attachments, author, createdAt, channel, reference } =
      message;
    const { id: userID, displayName: userName, bot: isBot } = author;

    const threadID = message.channel.id;
    const threadName = message.channel.name;

    if (!channel.isThread() || isBot) return;
    const prefix = "ts ";
    if (contentLower.startsWith(prefix)) return;

    const command = content.trim();
    const attachment = attachments.first();
    const logMessage = `${createdAt}\nPublico (hilo): ${userName} ${userID}\nmsg: ${command}`;

    // Función para enviar mensajes largos
    const sendLongMessage = async (msg) => {
      if (msg.length > 2000) {
        await channel.send(msg.slice(0, 2000));
        await channel.send(msg.slice(2000));
      } else {
        await channel.send(msg);
      }
    };

    // Manejo de errores
    const handleError = (err) => {
      console.error("Error de comando (hilos):", err.message);
      message.reply("> *Hubo un error ejecutando este comando.*");
    };

    // Manejo de mensajes referenciados
    let referencedMessageContent = null;
    if (reference) {
      try {
        const referencedMessage = await channel.messages.fetch(
          reference.messageId
        );
        referencedMessageContent = referencedMessage.content;
        console.log(`Mensaje referenciado: ${referencedMessageContent}`);
      } catch (err) {
        console.error("Error al obtener el mensaje referenciado:", err.message);
      }
    }

    try {
      console.log(logMessage);

      await channel.sendTyping();

      if (attachment) {
        console.log(`${logMessage}\n${attachment.url}`);
        const imgResponse = await imageVision(
          threadID,
          threadName,
          command,
          attachment.url
        );
        imgResponse
          ? await sendLongMessage(imgResponse)
          : handleError(new Error("Error procesando la imagen"));
      } else {
        const finalCommand = referencedMessageContent
          ? `${referencedMessageContent} ${command}`
          : command;
        const textResponse = await textReq(
          threadID,
          threadName,
          finalCommand,
          true
        );
        textResponse
          ? await sendLongMessage(textResponse)
          : handleError(new Error("Error procesando el texto"));
      }
    } catch (err) {
      handleError(err);
    }
  },
};
