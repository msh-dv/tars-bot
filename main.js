import fs from "node:fs";
// import path from "node:path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import connectDB from "./modules/mongo/db.js";
import { loadUsersToMap } from "./modules/conversations/conversationsHistory.js";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const foldersPath = join(__dirname, "comandos");
const commandFolders = fs.readdirSync(foldersPath);
console.log("Cargando comandos...");
for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const { default: command } = await import(filePath);
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

const eventsPath = join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

console.log("\nCargando Eventos...");
for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const { default: event } = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
    console.log(`Evento unico ${event.name} listo!`);
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
