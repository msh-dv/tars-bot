const OpenAI = require("openai");
const isBadWord = require("../../badwords/badWords");
require("dotenv").config();
const openai = new OpenAI();

async function imageModel(imgPrompt, model = "dall-e-2", size = "1024x1024") {
  try {
    if (isBadWord(imgPrompt)) {
      return false;
    }

    const image = await openai.images.generate({
      model: model,
      prompt: imgPrompt,
      n: 1,
      size: size,
    });

    return image.data[0].url;
  } catch (error) {
    console.error("Error de OpenAI(Imagen):", err.message);
  }
}

module.exports = imageModel;
