import { Client } from "discord.js";
import { getGuilds } from "../mongoDB/databaseOperations";

interface assignmentObject {
  assignmentType: string;
}

export = {
  name: "webhookReceived",
  async execute(client: Client, dataObject: assignmentObject) {
    //get all channels that need to receive the warn
    const guildsToNotify = await getGuilds();
    guildsToNotify.forEach(async (callback) => {
      let guildId = callback.guildId;
      let channelIds = callback.channelId;
      let guild = await client.guilds.fetch(guildId);
      channelIds.forEach(async (callback) => {
        let channel = await guild.channels.fetch(callback);
        if (!channel?.isTextBased())
          throw new Error("channel could not be fetched");
        switch (dataObject.assignmentType) {
          case "HOMEWORK":
            {
              let anyObject = dataObject as any;
              channel.send(
                `Novo dever de casa pra amanhã, matéria: ${anyObject.subject}, páginas: ${anyObject.pages}`
              );
            }
            break;
          case "ESSAY":
            {
              let anyObject = dataObject as any;
              channel.send(
                `Nova redação pra amanhã, tema: ${anyObject.prompt}, gênero: ${anyObject.genre}`
              );
            }
            break;
          case "BOOK": {
            let anyObject = dataObject as any;
            channel.send(
              `Lembrete para levar o livro de ${anyObject.subject} volume ${anyObject.chapter} amanhã.`
            );
          }

          default:
            break;
        }
      });
    });
    //send the warn
  },
};
