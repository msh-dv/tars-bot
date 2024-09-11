// Informacion sobre comandos
const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra informacion de ayuda."),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const helpEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Comandos")
      .setAuthor({
        name: "msh-dv",
        iconURL: "https://avatars.githubusercontent.com/u/113065583?v=4",
        url: "https://github.com/msh-dv",
      })
      .setDescription(bold("Información sobre comandos:"))
      .setThumbnail(
        "https://msh-dv.github.io/tars-website/images/profile-picture.png"
      )
      .addFields({
        name: `ts mensaje`,
        value: "Prefijo para chat, similar a /chat y /priv",
      })
      .setTimestamp();

    commands.forEach((command) => {
      helpEmbed.addFields({
        name: `/${command.data.name}`,
        value: `${command.data.description}`,
        inline: true,
      });
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};
