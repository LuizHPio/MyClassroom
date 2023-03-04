import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com pong!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};
