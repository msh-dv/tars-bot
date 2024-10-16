import textReq from "../modules/openai/textModel.js";
import imageVision from "../modules/openai/imageVision.js";
import { getUser } from "../modules/conversations/conversationsHistory.js";
import { isThreadInHistory } from "../modules/conversations/conversationsHistory.js";

const recentMessages = new Map();
const TIME_FRAME = 1000;
const MAX_MESSAGES = 2;

export default {
  name: "messageCreate",
  once: false,
  async execute(message) {
    const { content, attachments, author, channel, reference } = message;
    const { id: userID, displayName: userName, bot: isBot } = author;

    const threadID = message.channel.id;
    const threadName = message.channel.name;

    if (!channel.isThread() || isBot || !isThreadInHistory(threadID)) return;
    const prefix = "ts ";
    const noResponse = ";;";
    if (
      content.toLowerCase().startsWith(prefix) ||
      content.toLowerCase().startsWith(noResponse)
    )
      return;

    getUser(userID, userName);
    const now = Date.now();
    const messageHistory = recentMessages.get(userID) || [];
    const recentMessagesCount = messageHistory.filter(
      (timestamp) => now - timestamp < TIME_FRAME
    ).length;

    if (recentMessagesCount >= MAX_MESSAGES) {
      message.reply(
        "> *Estás enviando mensajes muy rápido. Por favor, espera unos segundos.*"
      );
      return;
    }

    messageHistory.push(now);
    recentMessages.set(userID, messageHistory);

    const command = content.trim();
    const attachment = attachments.first();

    const sendLongMessage = async (msg) => {
      if (msg.length > 2000) {
        await channel.send(msg.slice(0, 2000));
        await channel.send(msg.slice(2000));
      } else {
        await channel.send(msg);
      }
    };

    const handleError = (err) => {
      console.error("Error de comando (hilos):", err);
      message.reply("> *Hubo un error ejecutando este comando.*");
    };

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
      await channel.sendTyping();
      if (referencedAttachmentUrl) {
        const finalCommand = `${referencedMessageContent} ${command}`.trim();
        const imgResponse = await imageVision(
          userID,
          userName,
          finalCommand,
          referencedAttachmentUrl,
          userID
        );
        if (imgResponse) {
          await sendLongMessage(imgResponse);
        } else {
          handleError(new Error("Error procesando la imagen referenciada"));
        }
      } else if (attachment) {
        const imgResponse = await imageVision(
          threadID,
          threadName,
          command,
          attachment.url,
          true,
          userID
        );
        imgResponse
          ? await sendLongMessage(imgResponse)
          : handleError(new Error("Error procesando la imagen"));
      } else {
        const finalCommand = referencedMessageContent
          ? `${referencedMessageContent} ${command}`
          : command;
        const usernameCommand = `${userName}:${finalCommand}`;
        const textResponse = await textReq(
          threadID,
          threadName,
          usernameCommand,
          true,
          userID
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
