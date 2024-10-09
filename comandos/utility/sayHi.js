import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("hi").setDescription("Saluda.:)"),
  async execute(interaction) {
    await interaction.reply(`Hola, ${interaction.user.username}! ;)`);
  },
};
