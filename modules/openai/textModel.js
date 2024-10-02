const { getUser, getThread } = require("../conversations/conversationsHistory");
const userModel = require("../mongo/models/Users");
const threadModel = require("../mongo/models/Threads");
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

  function getData(isThread, id) {
    if (isThread) {
      return threadModel.findOne({ id: id });
    } else {
      return userModel.findOne({ id: id });
    }
  }

  function getModel(isThread) {
    return isThread ? threadModel : userModel;
  }

  const instance = await getInstance(isThread, id, name);
  console.log(instance);
  const data = await getData(isThread, id, name);
  const model = getModel(isThread);
  const backupHistory = [...instance.dynamicHistory];

  try {
    const result = await moderation(message);
    if (result.flagged)
      return "> *Este mensaje infringe nuestras políticas de uso.*";

    instance.addMessage({ role: "user", content: message });

    const history = instance.getFullHistory();
    const response = await generateCompletion(id, history, data.textModel);
    // --- Pasar el modelo de usuario como argumento ---

    instance.addMessage({ role: "assistant", content: response });

    await model.updateOne(
      { id: id },
      { $set: { dynamicHistory: instance.dynamicHistory } }
    );

    return response;
  } catch (error) {
    instance.dynamicHistory = backupHistory;

    await model.updateOne(
      { id: id },
      { $set: { dynamicHistory: backupHistory } }
    );
    console.error("Error de OpenAI (Texto):", error);
    return `> *Error procesando tu solicitud. Por favor, intenta de nuevo más tarde.*`;
  }
}

module.exports = textModel;
