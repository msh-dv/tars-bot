const { getUser, getThread } = require("../conversations/conversationsHistory");
const generateCompletion = require("./generateCompletion");
const moderation = require("../moderation/moderation");

async function textModel(id, name, message, isThread = false) {
  function getInstance(isThread, id, name) {
    if (isThread) {
      return getThread(id, name);
    } else {
      return getUser(id, name);
    }
  }

  const instance = getInstance(isThread, id, name);
  const backupHistory = [...instance.dynamicHistory];

  try {
    const result = await moderation(message);
    if (result.flagged)
      return "> *Este mensaje infringe nuestras políticas de uso.*";

    instance.addMessage({ role: "user", content: message });

    const history = instance.getFullHistory();
    const response = await generateCompletion(history, instance.TextModel);

    instance.addMessage({ role: "assistant", content: response });
    return response;
  } catch (error) {
    console.error("Error de OpenAI (Texto):", error.message);
    instance.dynamicHistory = backupHistory;
    console.log("Restaurando historial.");
    return `> *Error procesando tu solicitud. Por favor, intenta de nuevo más tarde.*`;
  }
}

module.exports = textModel;
