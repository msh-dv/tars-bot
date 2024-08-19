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
    const id = interaction.member.id;
    const name = interaction.member.displayName;

    if (id != "725826170519552172") {
      return await interaction.editReply("> *Acceso limitado por el momento*");
    }

    try {
      const prompt = interaction.options.getString("prompt");
      let model = interaction.options.getString("model") || "dall-e-2";
      let size = interaction.options.getString("size") || "1024x1024";

      if (model == "dall-e-2" && (size == "1792x1024" || size == "1024x1792")) {
        return await interaction.editReply(
          "> *Este tamaño no esta disponible para este modelo*"
        );
      }

      const response = await imageModel(id, name, prompt, model, size);

      if (response) {
        const exampleEmbed = new EmbedBuilder()
          .setColor("White")
          .setTitle("Image generation with DALL-E")
          .addFields({ name: "Prompt:", value: `${prompt}` })
          .addFields({ name: "Size:", value: `${size}` })
          .setImage(`${response}`)
          .setTimestamp()
          .setFooter({
            text: `Generated with ${model.toUpperCase()}`,
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
      await interaction.editReply(
        "> *Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system*"
      );
    }
  },
};
