import axios from "axios";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import imageModel from "../../modules/openai/imageModel.js";
import { getUser } from "../../modules/conversations/conversationsHistory.js";
import modelUser from "../../modules/mongo/models/Users.js";

export default {
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
        .setName("quality")
        .setDescription("Image quality.")
        .addChoices(
          { name: "Standard", value: "standard" },
          { name: "HD", value: "hd" }
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
    getUser(userID, userName);
    const prompt = interaction.options.getString("prompt");
    const dbUserData = await modelUser.findOne({ id: userID });
    const userModel = dbUserData.imageModel;

    // TODO:Arreglar peticion de imagenes

    try {
      let model = interaction.options.getString("model") || userModel;
      let size = interaction.options.getString("size") || "1024x1024";
      let quality = interaction.options.getString("quality") || "standard";

      if (
        model == "dall-e-2" &&
        (size == "1792x1024" || size == "1024x1792" || quality == "hd")
      ) {
        return await interaction.editReply(
          "> *Esta opcion no esta disponible para este modelo*"
        );
      }
      if (model == "dall-e-3" && dbUserData.subscription == "free") {
        return await interaction.editReply(
          "> Only premium users can use DALL-E-3."
        );
      }

      try {
        const response = await imageModel(
          prompt,
          model,
          size,
          quality,
          userID,
          userName
        );

        if (response.error) {
          return await interaction.editReply(response.message);
        }

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
          .addFields({ name: "Quality:", value: `${quality}` })
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
        console.error("Error Descargando la imagen:", error);
        await interaction.editReply({
          content: "> Hubo un error procesando la imagen",
        });
      }
    } catch (err) {
      console.error("Error de comando(Imagen):", err);
      await interaction.editReply(
        "> *Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system*"
      );
    }
  },
};
