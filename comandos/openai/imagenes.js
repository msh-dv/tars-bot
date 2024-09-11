const imageModel = require("../../modules/openai/imageModel");
const { getUser } = require("../../modules/users/usersHistory");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Genera imagenes con modelos como DALL-E-3")
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
    const userID = interaction.member.id;
    const userName = interaction.member.displayName;
    const date = interaction.createdAt;
    const prompt = interaction.options.getString("prompt");

    if (userID != "725826170519552172") {
      return await interaction.editReply("> *Acceso limitado por el momento*");
    }

    const userData = getUser(userID, userName);
    const userModel = userData.ImageModel;

    try {
      console.log(`${date}\nImagen: ${userName} ${userID}\nprompt: ${prompt}`);

      let model = interaction.options.getString("model") || userModel;
      let size = interaction.options.getString("size") || "1024x1024";

      if (model == "dall-e-2" && (size == "1792x1024" || size == "1024x1792")) {
        return await interaction.editReply(
          "> *Este tamaño no esta disponible para este modelo*"
        );
      }

      const response = await imageModel(prompt, model, size);

      if (response) {
        try {
          console.log("Descargando imagen");
          const imageResponse = await axios.get(response, {
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(imageResponse.data, "binary");

          const attachment = new AttachmentBuilder(imageBuffer, {
            name: "imagen.png",
          });

          const exampleEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("Image generation")
            .addFields({ name: "Prompt:", value: `${prompt}` })
            .addFields({ name: "Size:", value: `${size}` })
            .setImage("attachment://imagen.png")
            .setTimestamp()
            .setFooter({
              text: `Generated with ${model.toUpperCase()}`,
              iconURL:
                "https://msh-dv.github.io/tars-website/images/profile-picture.png",
            });
          await interaction.editReply({
            embeds: [exampleEmbed],
            files: [attachment],
          });
        } catch (error) {
          console.error("Error Descargandola imagen:", err.message);
          await interaction.editReply({
            content: "> Hubo un error procesando la imagen",
          });
        }
      } else {
        await interaction.editReply("> Hubo un error procesando la imagen");
      }
    } catch (err) {
      console.error("Error de comando(Imagen):", err.message);
      await interaction.editReply(
        "> *Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system*"
      );
    }
  },
};
