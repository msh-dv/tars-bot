const OpenAI = require("openai");
const openai = new OpenAI();
const userModel = require("../mongo/models/Users");
require("dotenv").config();

async function generateCompletion(
  id,
  history,
  model,
  max_tokens = 500,
  isThread = false,
  userID
) {
  try {
    let userBalance;

    if (isThread) {
      userBalance = await userModel.findOne({ id: userID });
    } else {
      userBalance = await userModel.findOne({ id: id });
    }

    if (!userBalance) throw new Error("Usuario no encontrado");

    const completion = await openai.chat.completions.create({
      messages: history,
      model: model,
      max_tokens: max_tokens,
    });

    const usage = completion.usage;
    const inputTokens = usage.prompt_tokens;
    const outputTokens = usage.completion_tokens;
    const totalTokens = usage.total_tokens;

    const tarsIn = inputTokens;
    const tarsOut = outputTokens * 4;
    const tarsTotal = (tarsIn + tarsOut) * 2;

    console.log(
      `Real:\nModel: ${model}\nInput: ${inputTokens}\nOutput: ${outputTokens}\n Total: ${totalTokens}`
    );
    console.log();
    console.log(
      `TARS:\nModel: ${model}\nInput: ${tarsIn}\nOutput: ${tarsOut}\n Total: ${tarsTotal}`
    );
    console.log();

    if (userBalance.tokens < tarsTotal) {
      return `No tienes suficientes tokens. ;)`;
    }
    userBalance.tokens -= tarsTotal;

    await userBalance.save();

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error("Error en la generación de IA");
  }
}

module.exports = generateCompletion;
