const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const isBadWord = require("../../badwords/badWords");
require("dotenv").config();

const openai = new OpenAI();

async function textModel(id, name, message, attachment) {
  if (await isBadWord(message)) {
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

  console.log(`Message: ${id}:${name}:
    ${message}`);

  const history = userInstance.getFullHistory();

  const completion = await openai.chat.completions.create({
    messages: history,
    model: "gpt-4o-mini",
  });

  const chatCompletion = completion.choices[0].message.content;

  userInstance.addMessage({ role: "user", content: chatCompletion });

  return chatCompletion;
}

module.exports = textModel;
