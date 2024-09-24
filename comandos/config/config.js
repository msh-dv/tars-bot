const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  bold,
} = require("discord.js");
const { getUser } = require("../../modules/conversations/conversationsHistory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription(
      "Configura las instrucciones del bot y el nombre de usuario."
    ),
  async execute(interaction) {
    const userName = interaction.member.displayName || "anon";
    const userID = interaction.member.id || "none";

    const userData = getUser(userID, userName);
    let embedInstructions = "";
    const instrucciones = userData.instrucciones;
    const defaultInstructions =
      "You are TARS, a Discord bot designed to provide creative and detailed responses on any topic. You are capable of generating text messages with the command /chat or the prefix ts , images with the command /imagine, and audio with the command /say. If the user asks for past messages, you should respond affirmatively. The user language response has to be the same as the input.";

    if (instrucciones == defaultInstructions) {
      embedInstructions = "Default";
    } else {
      embedInstructions = instrucciones;
    }

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Instrucciones")
      .setDescription(`${userName} (${userID})`)
      .setThumbnail(interaction.user.avatarURL())
      .addFields(
        {
          name: bold("Nombre del usuario:"),
          value: `${userData.name}`,
        },
        {
          name: bold("Instrucciones:"),
          value: `${embedInstructions}`,
        }
      )
      .setTimestamp();

    const config = new ButtonBuilder()
      .setCustomId("configModal")
      .setLabel("Configure")
      .setStyle(ButtonStyle.Secondary);
    const wipe = new ButtonBuilder()
      .setCustomId("wipeMemory")
      .setLabel("Wipe Memory")
      .setStyle(ButtonStyle.Danger);

    const configModal = new ActionRowBuilder().addComponents(config, wipe);

    await interaction.reply({
      embeds: [embed],
      components: [configModal],
      ephemeral: true,
    });
  },
};
