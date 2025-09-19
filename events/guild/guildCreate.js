const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {
		const toggleFeatureModel = message.client.models.toggleFeature;
		const funModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'fun' } });
		const autoembedModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'autoembed' } });
		const welcomeModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'welcome' } });
		const leaveModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'leave' } });
		const messageRoleModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'messagerole' } });
		const joinRoleModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'joinrole' } });

		// set defaults if don't exist
		if (!funModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'fun', enabled: true });}
		if (!autoembedModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'autoembed', enabled: true });}
		if (!welcomeModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'welcome', enabled: true });}
		if (!leaveModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'leave', enabled: true });}
		if (!messageRoleModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'messagerole', enabled: true });}
		if (!joinRoleModel) {toggleFeatureModel.upsert({ guild_id: guild.id, feature: 'joinrole', enabled: true });}

		console.log(`Joined guild ${guild.name}`);
	},
};
