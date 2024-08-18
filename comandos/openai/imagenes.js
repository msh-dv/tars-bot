const imageModel = require("../../modules/openai/imageModel");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Genera imagenes con DALL-E-3")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Descripcion de la imagen.")
        .setRequired(true)
        .setMaxLength(4_50)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("Modelo para generar la imagen.")
        .addChoices(
          { name: "DALL-E-2", value: "dall-e-2" },
          { name: "DALL-E-3", value: "dall-e-3" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("size")
        .setDescription("Tamaño de la imagen a generar.")
        .addChoices(
          { name: "1024x1024", value: "1024x1024" },
          { name: "1792x1024", value: "1792x1024" },
          { name: "1024x1792", value: "1024x1792" }
        )
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
        await interaction.editReply(`> *This message violates our usage policies.* 
      > *Este mensaje inflige nuestras politicas de uso.*`);
      }
    } catch (err) {
      console.error(err);
    }
  },
};
