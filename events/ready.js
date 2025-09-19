const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
		if (process.env.ISUPPOSE != 'isuppose') {
			console.error('Not Supposing');
			process.exit(0);
		}
	},
};
