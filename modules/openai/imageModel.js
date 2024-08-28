const OpenAI = require("openai");
const moderation = require("../moderation/moderation");
require("dotenv").config();
const openai = new OpenAI();

async function imageModel(imgPrompt, model = "dall-e-2", size = "1024x1024") {
  try {
    const result = await moderation(imgPrompt);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
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
    console.error("Error de OpenAI(Imagen):", error.message);
  }
}

module.exports = imageModel;
