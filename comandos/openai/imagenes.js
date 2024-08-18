const imageModel = require("../../modules/openai/imageModel");
const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");

module.exports = {
  //Creamos un comando de slash "/"
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Genera imagenes con DALL-E-3")
    .addStringOption((option) =>
      option
        //Pedimos un mensaje al usuario
        .setName("prompt")
        .setDescription("Descripcion de la imagen.")
        .setMaxLength(4_50)
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    if (interaction.member.id != "725826170519552172") {
      return await interaction.editReply("> *Acceso limitado por el momento*");
    }

    try {
      const prompt = interaction.options.getString("prompt");

      const response = await imageModel(prompt);

      if (response) {
        const exampleEmbed = new EmbedBuilder()
          .setColor("White")
          .setTitle("Image generation with DALL-E")
          .addFields({ name: "Prompt:", value: `${prompt}` })
          .addFields({ name: "Size:", value: "1024x1024" })
          .setImage(`${response}`)
          .setTimestamp()
          .setFooter({
            text: "Generated with DALL-E-2",
            iconURL:
              "https://msh-dv.github.io/tars-website/images/profile-picture.png",
          });
        await interaction.editReply({ embeds: [exampleEmbed] });
      } else {
        await interaction.editReply("> *Esto esta mal*");
      }
    } catch (err) {
      console.error(err);
    }
  },
};
