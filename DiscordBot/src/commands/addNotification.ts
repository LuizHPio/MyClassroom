import {
  SlashCommandBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { addChannel } from "../mongoDB/databaseOperations";

export = {
  data: new SlashCommandBuilder()
    .setName("adicionarcanal")
    .setDescription("Escolher esse canal para receber avisos!")
    .addChannelOption((option) =>
      option
        .setName("canal")
        .setDescription("Canal que será notificado.")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    let option = interaction.options;
    let channel;
    if (option instanceof CommandInteractionOptionResolver) {
      channel = option.getChannel("canal");
    }
    if (!channel?.isTextBased()) return;

    await addChannel(interaction, channel.id);
    interaction.reply({ content: "Canal adicionado", ephemeral: true });
  },
};
