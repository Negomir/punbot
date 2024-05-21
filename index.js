const got = require("got");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const discordToken = process.env.DISCORD_TOKEN;

// GatewayIntentBits define which intents the bot is allowed to use.
// Guilds gives the bot access to information about Guilds (Servers).
// GuildMessages allows the bot to detect and see the contents of messages
// send in the guild's text channels.
// GuildMembers allows the bot to get guild members (users), and their guild
// specific info (ex. roles).
// DirectMessages allows the bot to send direct messages to members.
// GuildPresences allows the bot to get additional info on members.
const discord = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildPresences,
	],
});

// We store the id returned by setInterval so we can stop it when needed.
var purgatoryIntervals = {};

// setIntervalForUser creates a new interval for the given user if one doesn't
// already exist.
const setIntervalForUser = (user) => {
	// If the user's id is already a key in purgatoryIntervals we do nothing.
	if (user.id in purgatoryIntervals) {
		return;
	}

	// setInterval will call the passed callback func every 5 minutes.
	purgatoryIntervals[user.id] = setInterval(() => {
		got.get("https://icanhazdadjoke.com/", {
			headers: {
				accept: "text/plain",
			},
		}).then(response => {
			user.send(response.body)
				.then(() => console.log(`sent pun to ${user.displayName}`))
				.catch(err => {
					console.log(`failed sending put to ${user.displayName}`);
					console.error(err);
				});
		}).catch(console.error);
	}, 1000 * 60 * 5);

	console.log(`set interval for ${user.displayName}`);
};

// Once will listen to the Events.ClientReady event but will only trigger once.
// We use this to get all members with the Pun Hell role on startup and start
// their intervals.
discord.once(Events.ClientReady, () => {
	activeGuilds = discord.guilds.cache.each(guild => {
		const role = guild.roles.cache.find(role => role.name == "Pun Hell");
		role.members.each(setIntervalForUser);
	});
});

// On will listen to the Events.GuildMemberUpdate event which is called when
// there is an update to any of the guilds' members, including gaining or
// losing a role. The callback has the user before update, and the user after
// update passed as parameters, which allows us to compare and check if the
// role is gained or lost.
discord.on(Events.GuildMemberUpdate, (before, after) => {
	const hadRole = before.roles.cache.some(role => role.name == "Pun Hell");
	const hasRole = after.roles.cache.some(role => role.name == "Pun Hell");

	// If the role is gained, we start the interval.
	// If the role is lost, we stop the interval.
	if (!hadRole && hasRole) {
		console.log(`user ${after.id} has gained the role`);
		setIntervalForUser(after);
	} else if (hadRole && !hasRole) {
		console.log(`user ${after.id} has lost the role`);
		if (after.id in purgatoryIntervals) {
			clearInterval(purgatoryIntervals[after.id]);
			delete purgatoryIntervals[after.id];
		}
	}
});

// login will set up the connection with discord. Once the connection is
// fully setup, the Events.ClientReady event will be emitted.
discord.login(discordToken);
