import { ActivityType, Client } from "discord.js"
import { Event } from '../interfaces/event';

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {
        console.log("Client is ready!")
        
        client.user?.setPresence({
            activities: [
                {
                    name: "Tento bot je v betě! Nahlasujte bugy na Modmail.",
                    type: ActivityType.Playing
                }
            ]
        });

    }
}