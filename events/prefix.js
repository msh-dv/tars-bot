const badWords = require("../modules/badWords");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const instrucciones = `You are TARS, a Discord bot that uses OpenAI models to provide creative and detailed responses on any topic. The user language respons has to be the same that the input`;

const model = "gpt-4o-mini";

let history = [{ role: "system", content: instrucciones.trim() }];

const prefix = "ts ";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content.slice(prefix.length).trim();

    if (badWords(content)) {
      return message.channel.send(`Este mensaje inflinge nuestras politicas de uso.`).catch(console.error);
    }

    let msgUsername = message.member.displayName;

    if (!msgUsername) msgUsername = "user";

    history.push(
      {
        role: "system",
        content: `The user name is ${msgUsername}`,
      },
      { role: "user", content: content }
    );

    const mensajes = history;

    const completion = await openai.chat.completions.create({
      messages: mensajes,
      model: model,
      max_tokens: 400,
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

    if (history.length > 30) {
      console.log("Restoring history");
      history = [{ role: "system", content: instrucciones.trim() }];
    }

    console.log(
      `Public: ${msgUsername} at ${message.createdAt}
      Message: ${content}
      Response: ${chatCompletion}, Response.length = ${chatCompletion.length}
      Tokens: ${completion.usage.total_tokens}
      `
    );
  },
};
