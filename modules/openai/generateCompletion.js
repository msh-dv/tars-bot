//Generacion de respuetas
import OpenAI from "openai";
import userModel from "../mongo/models/Users.js";

const openai = new OpenAI();
import "dotenv/config";

const defaultReload = 6 * 60 * 60 * 1000;

async function generateCompletion(
  id,
  history,
  model,
  max_tokens = 500,
  isThread = false,
  userID
) {
  try {
    let userData;

    if (isThread) {
      userData = await userModel.findOne({ id: userID });
    } else {
      userData = await userModel.findOne({ id: id });
    }

    if (!userData) throw new Error("Usuario no encontrado");

    if (userData.isWaiting) {
      const currentTime = Date.now();
      if (currentTime < userData.reloadTime) {
        const remainingTime = userData.reloadTime - currentTime;
        const hrs = Math.floor(remainingTime / (1000 * 60 * 60));
        const min = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );

        const sec = Math.floor((remainingTime % (1000 * 60)) / 1000);
        return `> You must wait ${hrs} hrs, ${min} min, ${sec} sec before you can reload tokens.`;
      } else {
        userData.tokens = 50000;
        userData.reloadTime = null;
        userData.isWaiting = false;
        await userData.save();
      }
    }

    const completion = await openai.chat.completions.create({
      messages: history,
      model: model,
      max_completion_tokens: max_tokens,
    });

    userData.lastUse = new Date();

    const completionText = completion.choices[0].message.content;

    const usage = completion.usage;

    const tarsIn = usage.prompt_tokens;
    const tarsOut = usage.completion_tokens * 4;
    const tarsTotal = (tarsIn + tarsOut) * 2;

    userData.usedTokens += tarsTotal;
    userData.completionsCount++;
    userData.tokensMedia = userData.usedTokens / userData.completionsCount;

    userData.tokenUsageHistory.completions.push({
      completion: {
        num: userData.completionsCount,
        date: new Date(),
        input_tokens: tarsIn,
        output_tokens: tarsOut,
        total_tokens: tarsTotal,
        content: completionText,
      },
    });

    if (userData.tokens < tarsTotal) {
      userData.tokens = 0;
      userData.isWaiting = true;
      userData.reloadTime = Date.now() + defaultReload;
      await userData.save();
      return completionText;
    }
    userData.tokens -= tarsTotal;

    await userData.save();

    return completionText;
  } catch (error) {
    console.error(error);
    throw new Error("Error en la generación de IA");
  }
}

export default generateCompletion;
