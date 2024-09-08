const { Events, PresenceUpdateStatus, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    //Mostramos los servidores y usuarios totales como una actividad Watching
    const guilds = client.guilds;
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

    // client.user.setActivity(, {
    //   type: ActivityType.Watching,
    // });
    console.log(`Ready! logged as ${client.user.tag}`);
  },
};
