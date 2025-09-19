const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, IntentsBitField, Partials } = require('discord.js');
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildModeration,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.DirectMessages,
	],
	partials: [
		Partials.Message,
		Partials.GuildMember,
		Partials.Reaction,
		Partials.User,
		Partials.Channel,
	],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

client.models = {
	welcomeMessage: require('./models/welcomeMessage')(sequelize, DataTypes),
	leaveMessage: require('./models/leaveMessage')(sequelize, DataTypes),
	toggleFeature: require('./models/toggleFeature')(sequelize, DataTypes),
	reactionRole: require('./models/reactionRole')(sequelize, DataTypes),
	messageRole: require('./models/messageRole')(sequelize, DataTypes),
	joinRole: require('./models/joinRole')(sequelize, DataTypes),
	messageAudit: require('./models/messageAudit')(sequelize, DataTypes),
};

client.sequelize = sequelize;

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getAllJsFiles(commandsPath);

for (const filePath of commandFiles) {
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = getAllJsFiles(eventsPath);

for (const filePath of eventFiles) {
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.DISCORD_TOKEN);


function getAllJsFiles(dir) {
	const files = [];

	for (const file of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			files.push(...getAllJsFiles(fullPath));
		}
		else if (file.endsWith('.js')) {
			files.push(fullPath);
		}
	}

	return files;
}