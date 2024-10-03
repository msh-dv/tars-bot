const { getUser, getThread } = require("../conversations/conversationsHistory");
const generateCompletion = require("./generateCompletion");
const userModel = require("../mongo/models/Users");
const threadModel = require("../mongo/models/Threads");
const moderation = require("../moderation/moderation");

async function textVision(
  id,
  name,
  message,
  attachment,
  isThread = false,
  userID
) {
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
  const data = await getData(isThread, id, name);
  const model = getModel(isThread);
  const backupHistory = [...instance.dynamicHistory];

  const checkExt = (fileName) => {
    const ext = ["png", "jpeg", "jpg", "gif", "webp"];
    const file = fileName.split("?")[0];
    const fileExt = file.split(".").pop().toLowerCase();

    if (!ext.includes(fileExt)) {
      return `> **Only "png", "jpeg/jpg", "gif" and "webp" are supported.**`;
    }
  };

  try {
    checkExt(attachment);
    const result = await moderation(message);
    if (result.flagged)
      return "> *Este mensaje infringe nuestras políticas de uso.*";

    instance.addMessage({
      role: "user",
      content: [
        { type: "text", text: message },
        { type: "image_url", image_url: { url: `${attachment}` } },
      ],
    });

    const history = instance.getFullHistory();
    const response = await generateCompletion(
      id,
      history,
      data.textModel,
      null,
      isThread,
      userID
    );

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
    console.error("Error de OpenAI (Imagen):", error.message);
    return `> *Archivo corrupto o con exptension incorrecta.*`;
  }
}

module.exports = textVision;
