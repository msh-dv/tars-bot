const textReq = require("../modules/openai/textModel");
const imageVision = require("../modules/openai/imageVision");
const prefix = "ts ";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    const { content, attachments, author, createdAt, channel, reference } =
      message;
    const { id: userID, displayName: userName, bot: isBot } = author;
    contentLower = content.toLowerCase();

    if (!contentLower.startsWith(prefix) || isBot) return;

    const command = content.slice(prefix.length).trim();
    const attachment = attachments.first();
    const logMessage = `${createdAt}\nPublico (prefijo): ${userName} ${userID}\nmsg: ${command}`;

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
      console.error("Error de comando (prefijo):", err.message);
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
          userID,
          userName,
          command,
          attachment.url
        );
        if (imgResponse) {
          if (imgResponse.length > 2000) {
            const firstPart = imgResponse.substring(0, 2000);
            const secondPart = imgResponse.substring(2000);

            message.channel.send(firstPart);
            message.channel.send(secondPart);
          } else {
            message.channel.send(imgResponse);
          }
        } else {
          message
            .reply("> *Hubo un error ejecutando este comando.*")
            .catch((err) => console.error(err));
        }
        imgResponse
          ? await sendLongMessage(imgResponse)
          : handleError(new Error("Error procesando la imagen"));
      } else {
        const finalCommand = referencedMessageContent
          ? `${referencedMessageContent} ${command}`
          : command;
        const textResponse = await textReq(userID, userName, finalCommand);
        textResponse
          ? await sendLongMessage(textResponse)
          : handleError(new Error("Error procesando el texto"));
      }
    } catch (err) {
      handleError(err);
    }
  },
};
