const OpenAI = require("openai");
const openai = new OpenAI();
require("dotenv").config();

async function generateCompletion(history, model, max_tokens = 500) {
  try {
    const completion = await openai.chat.completions.create({
      messages: history,
      model: model,
      max_tokens: max_tokens,
    });

    const realTokens = completion.usage.total_tokens;
    const tokenUsage = completion.usage.total_tokens * 2;

    console.log(
      `Request tokens = ${realTokens}\nAjuste de precio: ${tokenUsage}`
    );

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Error en la generación de IA");
  }
}

module.exports = generateCompletion;
