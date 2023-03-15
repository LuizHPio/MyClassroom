import axios from "axios";
import {
  SlashCommandBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import { getSubjectClosestDay } from "../utils/getSubjectClosestDay";

export = {
  data: new SlashCommandBuilder()
    .setName("livrosatualizar")
    .setDescription("Atualizar capítulo do livro!")
    .addStringOption((option) =>
      option
        .setName("materia")
        .setDescription("Matéria do dever")
        .setRequired(true)
        .addChoices(
          { name: "Português", value: "portuguese" },
          { name: "Matemática", value: "math" },
          { name: "Física", value: "physics" },
          { name: "Biologia", value: "biology" },
          { name: "Espanhol", value: "spanish" },
          { name: "Química", value: "chemistry" },
          { name: "Geografia", value: "geography" },
          { name: "Sociologia", value: "sociology" },
          { name: "Literature", value: "literature" },
          { name: "Filosofia", value: "philosophy" },
          { name: "Inglês", value: "english" },
          { name: "História", value: "history" },
          { name: "Artes e Música", value: "arts" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("capitulo")
        .setDescription("Capítulo atual")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("notificar")
        .setDescription("Enviar notificação para lembrar de trazer o livro.")
    ),
  async execute(interaction: CommandInteraction) {
    let optionHandle = interaction.options;

    let subject;
    let chapter;
    let notify;
    let guildId = interaction.guildId;

    if (optionHandle instanceof CommandInteractionOptionResolver) {
      subject = optionHandle.getString("materia");
      chapter = optionHandle.getNumber("capitulo");
      notify = optionHandle.getBoolean("notificar") ?? true;
    }

    let deadline;
    if (subject) deadline = getSubjectClosestDay(subject);

    if (deadline) {
      let dateObj = new Date(deadline);
      console.log(
        `Livro da matéria ${subject} atualizado, utilizando capitulo ${chapter}\nNotificar em ${dateObj.toDateString()}`
      );
    }

    let requestOptions = {
      method: "POST",
      url: "http://localhost:3000/books",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        guildId: guildId,
        subject: subject,
        chapter: chapter,
        notify: notify,
        deadline: deadline,
      },
    };
    try {
      let _ = await axios(requestOptions);
    } catch (err) {
      console.error(err);
      await interaction.reply("Erro em atualizar livro!");
    }
    await interaction.reply("Livro atualizado com sucesso!");
  },
};
