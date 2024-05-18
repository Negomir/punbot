const got = require("got");
const { Client, GatewayIntentBits } = require("discord.js");

const discordToken = process.env.DISCORD_TOKEN;

const discord = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
	],
});

discord.login(discordToken);

var purgatoryIntervals = {};

discord.on("guildMemberUpdate", (before, after) => {
	const hadRole = before.roles.cache.some(role => role.name == "Pun Hell");
	const hasRole = after.roles.cache.some(role => role.name == "Pun Hell");

	if (!hadRole && hasRole) {
		console.log(`user ${after.id} has gained the role`);
		purgatoryIntervals[before.id] = setInterval(() => {
			got.get("https://icanhazdadjoke.com/", {
				headers: {
					accept: "text/plain",
				},
			}).then(response => {
				after.send(response.body);
			}).catch(console.error);
		}, 5000);
	} else if (hadRole && !hasRole) {
		console.log(`user ${after.id} has lost the role`);
		if (before.id in purgatoryIntervals) {
			clearInterval(purgatoryIntervals[before.id]);
		}
	}
});
