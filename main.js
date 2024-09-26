const fs = require("node:fs");
const path = require("node:path");
const connectDB = require("./modules/mongo/db");
const {
  loadUsersToMap,
} = require("./modules/conversations/conversationsHistory");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

console.log(`
  ______ ___     ____  _____
 /_  __//   |   / __ \\/ ___/
  / /  / /| |  / /_/ /\\__ \\ 
 / /  / ___ | / _, _/___/ / 
/_/  /_/  |_|/_/ |_|/____/  
`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, "comandos");
const commandFolders = fs.readdirSync(foldersPath);
console.log("Cargando comandos...");
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`Comando: ${command.data.name} listo!`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

console.log("Cargando Eventos...");
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
    console.log(`Evento ${event.name} listo!`);
  } else {
    client.on(event.name, (...args) => event.execute(...args));
    console.log(`Evento ${event.name} listo!`);
  }
}

connectDB();
loadUsersToMap();

const token =
  process.env.ENV === "exp"
    ? process.env.DISCORD_EXPERIMENTAL_TOKEN
    : process.env.DISCORD_TOKEN;

client.login(token);
