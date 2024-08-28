const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const moderation = require("../moderation/moderation");
require("dotenv").config();

const openai = new OpenAI();

const uniqueFileName = `speech_${uuidv4()}.mp3`;
const speechFile = path.resolve(`./tmp/${uniqueFileName}`);

async function audioModel(model = "tts-1", voice = "nova", prompt) {
  try {
    const result = await moderation(prompt);

    if (result.flagged) {
      console.log(result.categories);
      console.log(result.category_scores);
      return false;
    }

    const audio = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: prompt,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return speechFile;
  } catch (error) {
    console.error("Error de OpenAI ( audio )", error.message);
  }
}

module.exports = audioModel;
