/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const welcomeMessageModel = require('./models/welcomeMessage')(sequelize, Sequelize.DataTypes);
const leaveMessageModel = require('./models/leaveMessage')(sequelize, Sequelize.DataTypes);
const toggleFeatureModel = require('./models/toggleFeature')(sequelize, Sequelize.DataTypes);
const reactionRoleModel = require('./models/reactionRole')(sequelize, Sequelize.DataTypes);
const messageRoleModel = require('./models/messageRole')(sequelize, Sequelize.DataTypes);
const joinRoleModel = require('./models/joinRole')(sequelize, Sequelize.DataTypes);
const messageAuditModel = require('./models/messageAudit')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync(force).then(async () => {
	const defaultInserts = [
		// welcomeMessageModel.upsert({ guild_id: process.env.GUILD_ID, message: '{user} has joined {server}', channel_id: process.env.CHANNEL_ID }),
		// leaveMessageModel.upsert({ guild_id: process.env.GUILD_ID, message: '{user} has left {server}', channel_id: process.env.CHANNEL_ID }),
		// toggleFeatureModel.upsert({ guild_id: process.env.GUILD_ID, feature: 'fun', enabled: true }),
		// toggleFeatureModel.upsert({ guild_id: process.env.GUILD_ID, feature: 'autoembed', enabled: true }),
		// toggleFeatureModel.upsert({ guild_id: process.env.GUILD_ID, feature: 'welcome', enabled: true }),
		// toggleFeatureModel.upsert({ guild_id: process.env.GUILD_ID, feature: 'leave', enabled: true }),
		// toggleFeatureModel.upsert({ guild_id: process.env.GUILD_ID, feature: 'messagerole', enabled: true }),
		// messageRoleModel.upsert({ guild_id: process.env.GUILD_ID, text: 'gamerpilled', role_id: '1063961543823347712' }),
	];

	await Promise.all(defaultInserts);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);