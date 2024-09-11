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
    const contentLower = content.toLowerCase();

    if (!contentLower.startsWith(prefix) || isBot) return;

    const command = content.slice(prefix.length).trim();
    const attachment = attachments.first();
    const logMessage = `${createdAt}\nPublico (prefijo): ${userName} ${userID}\nmsg: ${command}`;

    // Función para enviar mensajes largos
    const sendLongMessage = async (msg) => {
      while (msg.length > 2000) {
        await channel.send(msg.slice(0, 2000));
        msg = msg.slice(2000);
      }
      await channel.send(msg);
    };

    // Manejo de errores
    const handleError = (err) => {
      console.error("Error de comando (prefijo):", err.message);
      message.reply("> *Hubo un error ejecutando este comando.*");
    };

    // Manejo de mensajes referenciados
    let referencedMessageContent = "";
    let referencedAttachmentUrl = null;
    if (reference) {
      try {
        const referencedMessage = await channel.messages.fetch(
          reference.messageId
        );
        referencedMessageContent = referencedMessage.content;
        if (referencedMessage.attachments.size > 0) {
          referencedAttachmentUrl = referencedMessage.attachments.first().url;
        }
      } catch (err) {
        console.error("Error al obtener el mensaje referenciado:", err.message);
      }
    }

    try {
      console.log(logMessage);

      await channel.sendTyping();

      if (referencedAttachmentUrl) {
        console.log(`${logMessage}\n${referencedAttachmentUrl}`);
        const finalCommand = `${referencedMessageContent} ${command}`.trim();
        const imgResponse = await imageVision(
          userID,
          userName,
          finalCommand,
          referencedAttachmentUrl
        );
        if (imgResponse) {
          await sendLongMessage(imgResponse);
        } else {
          handleError(new Error("Error procesando la imagen referenciada"));
        }
      } else if (attachment) {
        console.log(`${logMessage}\n${attachment.url}`);
        const imgResponse = await imageVision(
          userID,
          userName,
          command,
          attachment.url
        );
        if (imgResponse) {
          await sendLongMessage(imgResponse);
        } else {
          handleError(new Error("Error procesando la imagen adjunta"));
        }
      } else {
        const finalCommand = `${referencedMessageContent} ${command}`.trim();
        const textResponse = await textReq(userID, userName, finalCommand);
        if (textResponse) {
          await sendLongMessage(textResponse);
        } else {
          handleError(new Error("Error procesando el texto"));
        }
      }
    } catch (err) {
      handleError(err);
    }
  },
};
