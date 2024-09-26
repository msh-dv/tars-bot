const { getUser, getThread } = require("../conversations/conversationsHistory");
const userModel = require("../mongo/models/Users");
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

  const instance = await getInstance(isThread, id, name);
  const userData = await userModel.findOne({ id: id });
  const backupHistory = [...instance.dynamicHistory];

  try {
    const result = await moderation(message);
    if (result.flagged)
      return "> *Este mensaje infringe nuestras políticas de uso.*";

    instance.addMessage({ role: "user", content: message });

    const history = instance.getFullHistory();
    const response = await generateCompletion(history, userData.textModel);

    instance.addMessage({ role: "assistant", content: response });

    await userModel.updateOne(
      { id: id },
      { $set: { dynamicHistory: instance.dynamicHistory } }
    );

    return response;
  } catch (error) {
    instance.dynamicHistory = backupHistory;

    await userModel.updateOne(
      { id: id },
      { $set: { dynamicHistory: backupHistory } }
    );
    console.error("Error de OpenAI (Texto):", error);
    return `> *Error procesando tu solicitud. Por favor, intenta de nuevo más tarde.*`;
  }
}

module.exports = textModel;
