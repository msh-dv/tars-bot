const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function moderation(message) {
  try {
    const mod = await openai.moderations.create({
      input: message,
    });

    const results = mod.results[0];

    return results;
  } catch (error) {
    console.error("Error de Openai (moderacion): ", error.message);
  }
}

module.exports = moderation;
