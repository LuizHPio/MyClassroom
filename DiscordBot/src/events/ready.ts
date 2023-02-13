import { Events, Client, BaseInteraction } from "discord.js";

export = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (!client.user) return;
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
