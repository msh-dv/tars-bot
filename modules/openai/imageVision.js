const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();

async function textVision(id, name, message, attachment) {
  try {
    const result = await moderation(message);
    const userInstance = getUser(id, name);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }
    const ext = ["png", "jpeg", "gif", "webp"];
    const filename = attachment.split("?")[0];
    const fileExt = filename.split(".").pop().toLowerCase();

    if (ext.includes(fileExt)) {
      console.log("Tipo:Imagen adjunta");
    } else {
      console.error(`Archivo no sportado: ${fileExt}`);
      return `> ***Only "png", "jpeg", "gif" and "webp" are supported.***`;
    }

    // TODO:Integrar el modulo textModel

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
    console.error("Error de Openai (Image Vision):", error.message);
  }
}

module.exports = textVision;
