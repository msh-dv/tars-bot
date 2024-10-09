//Generacion de resumenes
import OpenAI from 'openai';

const openai = new OpenAI();
import "dotenv/config";

async function summarizeMessage(message) {
  try {
    const instrucciones =
      "Summarize the following message, preserving the key details and most relevant information, in no more than two or three sentences:";

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: instrucciones },
        { role: "user", content: message },
      ],
      model: "gpt-4o-mini",
      max_completion_tokens: 300,
    });

    const usage = completion.usage;
    const completionText = completion.choices[0].message.content;

    const tarsIn = usage.prompt_tokens;
    const tarsOut = usage.completion_tokens * 4;
    const tarsTotal = (tarsIn + tarsOut) * 2;

    console.log(`SummMessage: ${tarsTotal} tokens`);

    return completionText;
  } catch (error) {
    console.error(error);
    throw new Error("Error en la generación de IA");
  }
}

export default summarizeMessage;
