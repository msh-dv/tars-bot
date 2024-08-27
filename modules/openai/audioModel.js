const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const isBadWord = require("../../badwords/badWords");
require("dotenv").config();

const openai = new OpenAI();

const uniqueFileName = `speech_${uuidv4()}.mp3`;
const speechFile = path.resolve(`./tmp/${uniqueFileName}`);

async function audioModel(model = "tts-1", voice = "nova", prompt) {
  try {
    if (isBadWord(prompt)) {
      return false;
    }

    const audio = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: prompt,
    });

    console.log(audio);
    console.log(speechFile);
    const buffer = Buffer.from(await audio.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return speechFile;
  } catch (error) {
    console.error("Error de OpenAI ( audio )", error.message);
  }
}

module.exports = audioModel;
