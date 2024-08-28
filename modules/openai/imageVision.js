const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();

async function textVision(id, name, message, attachment) {
  try {
    const result = await moderation(message);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    const userInstance = getUser(id, name);

    userInstance.addMessage({
      role: "user",
      content: [
        { type: "text", text: message },
        { type: "image_url", image_url: { url: `${attachment}` } },
      ],
    });

    const history = userInstance.getFullHistory();

    const completion = await openai.chat.completions.create({
      messages: history,
      model: "gpt-4o-mini",
    });

    const chatCompletion = completion.choices[0].message.content;

    userInstance.addMessage({ role: "user", content: chatCompletion });

    return chatCompletion;
  } catch (error) {
    console.error("Error de Openai:", error.message);
  }
}

module.exports = textVision;
