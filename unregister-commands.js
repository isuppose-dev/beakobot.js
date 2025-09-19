const { REST, Routes } = require('discord.js');
const { env } = require('node:process');
require('dotenv').config();

const rest = new REST().setToken(env.DISCORD_TOKEN);

(async () => {
	try {
		// CLear guild commands
		data = await rest.put(
			Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
			{ body: [] },
		);

		// Clear global commands
		data = await rest.put(
			Routes.applicationCommands(env.CLIENT_ID),
			{ body: [] },
		);

	}
	catch (error) { console.error(error); }
})();