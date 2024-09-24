const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI();

async function moderation(message) {
  try {
    const mod = await openai.moderations.create({
      input: message,
    });

    const result = mod.results[0];
    if (result.flagged) {
      console.log(result.categories, result.category_scores);
    }
    return result;
  } catch (error) {
    console.error("Error de Openai (moderacion): ", error.message);
  }
}

module.exports = moderation;
