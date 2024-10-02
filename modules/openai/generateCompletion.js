const OpenAI = require("openai");
const openai = new OpenAI();
const userModel = require("../mongo/models/Users");
require("dotenv").config();

async function generateCompletion(id, history, model, max_tokens = 500) {
  const userBalance = await userModel.findOne({ id: id });
  if (!userBalance) throw new Error("Usuario no encontrado");

  try {
    const completion = await openai.chat.completions.create({
      messages: history,
      model: model,
      max_tokens: max_tokens,
    });

    const realTokens = completion.usage.total_tokens;
    const tokenUsage = completion.usage.total_tokens * 2;

    if (userBalance.tokens < tokenUsage) {
      return `No tienes suficientes tokens. ;)`;
    }
    userBalance.tokens -= tokenUsage;

    await userBalance.save();

    console.log(
      `Model: ${model}\nRequest tokens = ${realTokens}\nAjuste de precio: ${tokenUsage}`
    );

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Error en la generación de IA");
  }
}

module.exports = generateCompletion;
