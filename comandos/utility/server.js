const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Muestra informacion sobre el servidor."),
  async execute(interaction) {
    const i = interaction.guild;
    await interaction.reply(
      `## ${i.name} (${i.id})

      Usuarios: ${i.memberCount}
      Creado desde: ${i.createdAt}
      Id del creador: ${i.ownerId}
      Boosts: ${i.premiumSubscriptionCount}

      `
    );
  },
};

const { SlashCommandBuilder, codeBlock, bold } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra informacion de ayuda."),
  async execute(interaction) {
    const exampleEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle(`${i.name} (${i.id})`)
      .setDescription(bold("Información del servidor:"))
      .setThumbnail(
        "https://msh-dv.github.io/tars-website/images/tars-profile.png"
      )
      .addFields(
        {
	  name: bold("Usuarios:"),
          value: `${i.memberCount}`,
        },
        {
	  name: bold("Creado desde:"),
          value: "Envia un mensaje privado a ChatGPT.",
        },
        {
          name: bold("/server"),
          value: "Muestra información del servidor.",
        },
        {
          name: bold("/info"),
          value: codeBlock("Muestra información del usuario."),
        },
        { name: bold("/hi"), value: codeBlock("Responde con un Hola!") },
        { name: bold("/echo"), value: codeBlock("Repite lo que le digas.") },
        { name: bold("/ping"), value: codeBlock("Responde con un Pong!") }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
