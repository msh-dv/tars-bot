const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const { getThread } = require("../threads/threadsHistory");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();

async function textModel(id, name, message, isThread = false) {
  const date = new Date();
  const threadInstance = getThread(id, name);
  const userInstance = getUser(id, name);
  try {
    const result = await moderation(message);

    // TODO: Separar modulo de moderacion
    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    if (isThread) {
      threadInstance.addMessage({ role: "user", content: message });

      const history = threadInstance.getFullHistory();
      const threadModel = threadInstance.TextModel;

      const completion = await openai.chat.completions.create({
        messages: history,
        model: threadModel,
        max_tokens: 500,
      });

      const chatCompletion = completion.choices[0].message.content;

      threadInstance.addMessage({ role: "assistant", content: chatCompletion });

      return chatCompletion;
    }

    userInstance.addMessage({ role: "user", content: message });

    const history = userInstance.getFullHistory();
    const userModel = userInstance.TextModel;

    const completion = await openai.chat.completions.create({
      messages: history,
      model: userModel,
      max_tokens: 500,
    });

    const chatCompletion = completion.choices[0].message.content;

    userInstance.addMessage({ role: "assistant", content: chatCompletion });

    return chatCompletion;
  } catch (error) {
    userInstance.wipeMemory();
    console.error(date, " Error de Openai (Texto): ", error.message);
    console.error(`${id} : ${name} : ${message}`);
  }
}

module.exports = textModel;
