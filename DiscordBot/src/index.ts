import express from "express";
import bodyParser from "body-parser";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { getSubjectClosestDay } from "./utils/getSubjectClosestDay";
require("dotenv").config({ path: "../.env" });

const app = express();
app.use(bodyParser.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith("js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

app.post("/webhook", (req: any, res: any) => {
  client.emit("webhookReceived", client, req.body);
  res.sendStatus(200);
});

app.listen(5000, () => {
  console.log("Listening for webhooks on port 5000.");
});

client.login(process.env.DISCORD_TOKEN);

client.emit("webhookReceived", client, {});
