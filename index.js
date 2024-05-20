const got = require("got");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const discordToken = process.env.DISCORD_TOKEN;

const discord = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildPresences,
	],
});

var purgatoryIntervals = {};

const setIntervalForUser = (user) => {
	if (user.id in purgatoryIntervals) {
		return;
	}

	purgatoryIntervals[user.id] = setInterval(() => {
		got.get("https://icanhazdadjoke.com/", {
			headers: {
				accept: "text/plain",
			},
		}).then(response => {
			user.send(response.body)
				.then(console.log(`sent pun to ${user.displayName}`))
				.catch(err => {
					console.log(`failed sending put to ${user.displayName}`);
					console.error(err);
				});
		}).catch(console.error);
	}, 1000 * 60 * 5);

	console.log(`set interval for ${user.displayName}`);
};

discord.once(Events.ClientReady, () => {
	activeGuilds = discord.guilds.cache.each(guild => {
		const role = guild.roles.cache.find(role => role.name == "Pun Hell");
		role.members.each(setIntervalForUser);
	});
});

discord.on(Events.GuildMemberUpdate, (before, after) => {
	const hadRole = before.roles.cache.some(role => role.name == "Pun Hell");
	const hasRole = after.roles.cache.some(role => role.name == "Pun Hell");

	if (!hadRole && hasRole) {
		console.log(`user ${after.id} has gained the role`);
		setIntervalForUser(after);
	} else if (hadRole && !hasRole) {
		console.log(`user ${after.id} has lost the role`);
		if (after.id in purgatoryIntervals) {
			clearInterval(purgatoryIntervals[after.id]);
		}
	}
});

discord.login(discordToken);
