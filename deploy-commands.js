const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { env } = require('node:process');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		let data = null;
		if (env.DEV === 'true') {
			data = await rest.put(
				Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
				{ body: commands },
			);
			console.log('Deploying to guild ' + env.GUILD_ID);
		}
		else {
			data = await rest.put(
				Routes.applicationCommands(env.CLIENT_ID),
				{ body: commands },
			);
			console.log('Deploying globally');
		}

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
