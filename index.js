const got = require("got");
const discord = require("discord.js");

function getPun() {
	got.get("https://icanhazdadjoke.com/", {
		headers: {
			accept: "text/plain",
		},
	}).then(response => {
		console.log(response.body);
	});
}

discord.login("token");

discord.on("guildeMemberUpdate", (before, after) => {
	const beforeRoles = before.roles.cache;
	const afterRoles = after.roles.cache;

	const beforeHasRole = beforeRoles.has("pun-purgatory");
	const afterHasRole = afterRoles.has("pun-purgatory");

	if (beforeHasRole && !afterHasRole) {
		// Role Removed
	} else if (!beforeHasRole && afterHasRole) {
		// Role Added
	}
})
