import { Events, ActivityType } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    //Mostrar los servidores y usuarios totales como una actividad Watching
    const guilds = client.guilds;
    const showGuildUsersCount = () => {
      const serverCount = guilds.cache.size;
      const userCount = guilds.cache.reduce((a, g) => a + g.memberCount, 0);
      client.user.setPresence({
        activities: [
          {
            name: `${serverCount} servers and ${userCount} users`,
            type: ActivityType.Watching,
          },
        ],
        status: "online",
      });
    };

    showGuildUsersCount();

    setInterval(showGuildUsersCount, 600000);

    console.log(`Listo! logeado como: ${client.user.tag}`);
  },
};
