const textReq = require("../modules/openai/textModel");
const imageVision = require("../modules/openai/imageVision");
const prefix = "ts ";

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const content = message.content.slice(prefix.length).trim();
    const attachmentURL = message.attachments.first();

    // TODO:Agregar una validacion para el id y nombre

    try {
      if (attachmentURL) {
        const imgResponse = await imageVision(
          message.author.id,
          message.author.displayName,
          content,
          attachmentURL.url
        );

        message.channel.send(imgResponse);
      } else {
        const res = await textReq(
          message.author.id,
          message.author.displayName,
          content
        );

        if (res) {
          if (res.length > 2000) {
            const firstPart = res.substring(0, 2000);
            const secondPart = res.substring(2000);

            message.channel.send(firstPart);
            message.channel.send(secondPart);
          } else {
            message.channel.send(res);
          }
        } else {
          message
            .reply(
              `> *This message violates our usage policies.*
      > *Este mensaje inflige nuestras politicas de uso.*`
            )
            .catch((err) => console.error(err));
        }
      }
    } catch (err) {
      console.error(err);
      message.reply("> *Hubo un error ejecutando este comando.*");
    }
  },
};
