// Importing libraries
import Discord, { Client, Collection, IntentsBitField } from 'discord.js';
import env from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';

// Registering environment variables
env.config({
    path: '../.env'
});

// Making a web server to run the bot on Repl.it
const app = express();
app.get("/", (req: Request, res: Response) => {
    res.send({
        status: 200
    })
});

// Initializing the client and creating a command collection
const client = new Discord.Client({
    intents: [
        // IDK why but Discord changed Intents to IntentsBitField
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});
client.commands = new Collection();

// Event handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('js'));
for (const file of eventFiles) {
    // For some reason, import can't be used here
    const event = require(`./events/${file}`);


    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

app.listen(8080, () => {
    console.log("Web server is ready!")
});
client.login(process.env.DISCORD_TOKEN);