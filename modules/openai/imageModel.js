import OpenAI from "openai";
import moderation from "../moderation/moderation.js";
import userModel from "../mongo/models/Users.js";
import "dotenv/config";

const openai = new OpenAI();
const defaultReload = 6 * 60 * 60 * 1000;

async function imageModel(
  imgPrompt,
  model = "dall-e-2",
  size = "1024x1024",
  quality = "standard",
  userID
) {
  try {
    const result = await moderation(imgPrompt);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    const dbUserData = await userModel.findOne({ id: userID });

    let imageTokenCost = 66000;

    // Calcular el costo según DALL-E 3
    if (model === "dall-e-3") {
      if (size === "1024x1024") {
        imageTokenCost = 132000; // DALL-E 3, tamaño normal
      } else if (size === "1024×1792" || size === "1792×1024") {
        imageTokenCost = 264000; // DALL-E 3, tamaño grande
      }

      if (quality === "hd") {
        if (size === "1024x1024") {
          imageTokenCost = 264000; // DALL-E 3, HD y tamaño normal
        } else if (size === "1024×1792" || size === "1792×1024") {
          imageTokenCost = 396000; // DALL-E 3, HD y tamaño grande
        }
      }
    }

    if (dbUserData.isWaiting) {
      const currentTime = Date.now();
      if (currentTime < dbUserData.reloadTime) {
        const remainingTime = dbUserData.reloadTime - currentTime;
        const hrs = Math.floor(remainingTime / (1000 * 60 * 60));
        const min = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const sec = Math.floor((remainingTime % (1000 * 60)) / 1000);
        return {
          error: true,
          message: `You must wait ${hrs} hrs, ${min} min, ${sec} sec before you can reload tokens.`,
        };
      } else {
        dbUserData.tokens = 50000;
        dbUserData.reloadTime = null;
        dbUserData.isWaiting = false;
        await dbUserData.save();
      }
    }

    if (dbUserData.tokens < imageTokenCost) {
      dbUserData.tokens = 0;
      dbUserData.isWaiting = true;
      dbUserData.reloadTime = Date.now() + defaultReload;
      await dbUserData.save();
      return {
        error: true,
        message: "Insufficient tokens.",
      };
    }

    // Generar la imagen
    const image = await openai.images.generate({
      model: model,
      prompt: imgPrompt,
      n: 1,
      size: size,
      quality: quality,
    });

    dbUserData.tokens -= imageTokenCost;

    if (dbUserData.tokens < 30000) {
      dbUserData.isWaiting = true;
      dbUserData.reloadTime = Date.now() + defaultReload;
    }

    dbUserData.lastUse = new Date();

    // Registrar el uso de tokens
    dbUserData.tokenUsageHistory.images.push({
      image: {
        date: new Date(),
        prompt: imgPrompt,
        model: model,
        size: size,
        quality: quality,
        output_tokens: imageTokenCost,
        content: image.data[0].url,
      },
    });

    await dbUserData.save();

    return image.data[0].url;
  } catch (error) {
    console.error("Error de OpenAI(Imagen):", error.message);
  }
}

export default imageModel;
