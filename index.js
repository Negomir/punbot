const got = require("got");

got.get("https://icanhazdadjoke.com/", {
	headers: {
		accept: "text/plain",
	},
}).then(response => {
	console.log(response.body);
});
