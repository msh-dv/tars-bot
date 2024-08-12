const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const instrucciones = `Eres TARS, un bot de discord que usa los modelos de OpenAI para dar respuestas creativas y detalladas de cualquier tema. The user's language should be the same as the language of the user's input. `;

const model = "gpt-4o-mini";

let history = [{ role: "system", content: instrucciones.trim() }];

const prefix = "ts ";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    const username = message.author.displayName;

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content.slice(prefix.length).trim();

    if (message.length == 0) {
      return message.channel.send("Por favor, proporciona una pregunta.");
    }

    history.push(
      {
        role: "system",
        content: `Recuerda que el nombre de usuario es ${username}`,
      },
      { role: "user", content: content }
    );

    const mensajes = history;

    const completion = await openai.chat.completions.create({
      messages: mensajes,
      model: model,
      max_tokens: 600,
    });

    const chatCompletion = completion.choices[0].message.content;

    history.push({ role: "assistant", content: chatCompletion.trim() });

    if (chatCompletion.length > 2000) {
      const firstPart = chatCompletion.substring(0, 2000);
      const secondPart = chatCompletion.substring(2000);

      message.channel.send(firstPart).catch(console.error);
      console.log(firstPart);
      message.channel.send(secondPart).catch(console.error);
      console.log(secondPart);
    } else {
      message.channel.send(chatCompletion).catch(console.error);
    }

    console.log(history.length);

    if (history.length > 120) {
      console.log("Reset history");
      console.log(history.length);
      history = [{ role: "system", content: instrucciones.trim() }];
    }

    console.log(
      `Public: ${username} at ${message.createdAt}
      Message: ${content}
      Response: ${chatCompletion}, Response.length = ${chatCompletion.length}
      Tokens: ${completion.usage.total_tokens}
      `
    );
  },
};
