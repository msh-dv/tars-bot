import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import moderation from "../moderation/moderation.js";
import userModel from "../mongo/models/Users.js";
import "dotenv/config";

const openai = new OpenAI();
const defaultReload = 6 * 60 * 60 * 1000;

const uniqueFileName = `speech_${uuidv4()}.mp3`;
const speechFile = path.resolve(`./tmp/${uniqueFileName}`);

async function audioModel(model = "tts-1", voice = "nova", prompt, userID) {
  try {
    const result = await moderation(prompt);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }
    const userData = await userModel.findOne({ id: userID });

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
        return {
          error: true,
          message: `You must wait ${hrs} hrs, ${min} min, ${sec} sec before you can reload tokens.`,
        };
      } else {
        userData.tokens = 50000;
        userData.reloadTime = null;
        userData.isWaiting = false;
        await userData.save();
      }
    }

    const audio = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: prompt,
    });

    userData.tokens -= prompt.length;

    if (userData.tokens < prompt.length) {
      userData.tokens = 0;
      userData.isWaiting = true;
      userData.reloadTime = Date.now() + defaultReload;
      await userData.save();
    }

    userData.lastUse = new Date();

    userData.tokenUsageHistory.audios.push({
      audio: {
        date: new Date(),
        input_chars: prompt.length,
        text: prompt,
      },
    });

    await userData.save();

    const buffer = Buffer.from(await audio.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return speechFile;
  } catch (error) {
    console.error("Error de OpenAI ( audio )", error.message);
  }
}

export default audioModel;
