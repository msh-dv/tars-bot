const textReq = require("../modules/openai/textModel");

const prefix = "ts ";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content.slice(prefix.length).trim();

    try {
      const res = await textReq(
        message.author.id,
        message.author.displayName,
        content
      );

      if (res) {
        if (res.length > 2000) {
          const firstPart = res.substring(0, 2000);
          const secondPart = res.substring(2000);

          message.channel.send(firstPart).catch(console.error);
          console.log(firstPart);
          message.channel.send(secondPart).catch(console.error);
          console.log(secondPart);
        } else {
          message.channel.send(res).catch(console.error);
        }
      } else {
        message
          .reply(
            `> *This message violates our usage policies.* 
      > *Este mensaje inflige nuestras politicas de uso.*`
          )
          .catch((err) => console.error(err));
      }
    } catch (err) {
      console.error(err);
      message.reply("> *Hubo un error ejecutando este comando.*");
    }
  },
};
