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

discord.on("messageCreate", message => {
	if (!message?.author.bot) {
		//message.author.send("test message");
		got.get("https://icanhazdadjoke.com/", {
			headers: {
				accept: "text/plain",
			},
		}).then(response => {
			message.channel.send(response.body);
		}).catch(console.error);
	}
});
