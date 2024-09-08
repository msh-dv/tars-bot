const OpenAI = require("openai");
const { getUser } = require("../users/usersHistory");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();
const date = new Date();

async function textVision(id, name, message, attachment) {
  try {
    const result = await moderation(message);
    const userInstance = getUser(id, name);
    const ext = ["png", "jpeg", "jpg", "gif", "webp"];
    const filename = attachment.split("?")[0];
    const fileExt = filename.split(".").pop().toLowerCase();

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    if (ext.includes(fileExt)) {
      console.log("Tipo:Imagen adjunta");
    } else {
      console.error(`Archivo no sportado: ${fileExt}`);
      return `> ***Only "png", "jpeg/jpg", "gif" and "webp" are supported.***`;
    }

    // TODO: Integrar el módulo textModel

    try {
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

      userInstance.addMessage({ role: "assistant", content: chatCompletion });

      return chatCompletion;
    } catch (error) {
      console.error(date, "Error de llamada Image Vision:", error.message);
      //Elimiar resgistro erroneo del historial para evitar errores
      userInstance.dynamicHistory.splice(-2, 2);
      return "> *Ocurrio un error con el comando, archivo corrupto o extension incorrecta.*";
    }
  } catch (error) {
    console.error(date, "Error de OpenAI (Image Vision):", error.message);
    console.error(`${id} : ${name} : ${message}\n${attachment}`);
    return false;
  }
}

module.exports = textVision;
