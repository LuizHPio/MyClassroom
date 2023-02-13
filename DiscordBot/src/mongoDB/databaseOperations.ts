import { CommandInteraction } from "discord.js";
import { DatabaseClient } from "./databaseConnection";

interface Guilds {
  guildId: string;
  channelId: string[];
}

export async function getGuilds() {
  const collection = DatabaseClient.collection("GUILDS");
  const cursor = collection.find();
  let GuildsArray: Guilds[] = [];
  await cursor.forEach((document) => {
    GuildsArray.push({
      guildId: document.guildId,
      channelId: document.channelId,
    });
  });
  return GuildsArray;
}

export async function addChannel(
  interaction: CommandInteraction,
  channelId: string
) {
  const collection = DatabaseClient.collection("GUILDS");
  const filter = { guildId: interaction.guildId };

  return collection.updateOne(
    filter,
    {
      $addToSet: { channelId: channelId },
    },
    { upsert: true }
  );
}
