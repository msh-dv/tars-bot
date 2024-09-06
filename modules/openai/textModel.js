const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();

async function textModel(id, name, message) {
  try {
    const result = await moderation(message);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    const userInstance = getUser(id, name);

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
    console.error("Error de Openai (Texto): ", error.message);
  }
}

module.exports = textModel;
