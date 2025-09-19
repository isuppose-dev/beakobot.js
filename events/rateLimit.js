const { Events } = require('discord.js');

module.exports = {
	name: Events.rateLimit,
	execute(rateLimitData) {
		console.log(`rateLimit: ${rateLimitData}`);
	},
};
