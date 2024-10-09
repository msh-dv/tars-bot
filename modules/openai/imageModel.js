import OpenAI from "openai";
import moderation from "../moderation/moderation.js";
import "dotenv/config";
const openai = new OpenAI();

async function imageModel(
  imgPrompt,
  model = "dall-e-2",
  size = "1024x1024",
  quality = "standard"
) {
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
      quality: quality,
    });

    return image.data[0].url;
  } catch (error) {
    console.error("Error de OpenAI(Imagen):", error.message);
  }
}

export default imageModel;
