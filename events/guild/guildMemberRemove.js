const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		if (member.partial) {
			try {
				await member.fetch();
			}
 			catch (error) {
				console.warn('Could not fetch partial member:', error);
				return;
			}
		}
		const leaveMessageModel = member.client.models.leaveMessage;
		const toggleFeatureModel = member.client.models.toggleFeature;
		let leaveMessage = await leaveMessageModel.findOne({ where: { guild_id: member.guild.id } });
		const leaveToggle = await toggleFeatureModel.findOne({ where: { guild_id: member.guild.id, feature: 'leave' } });

		if (!leaveMessage || !leaveMessage.channel_id || !leaveToggle || !leaveToggle.enabled) {return;}

		const channelId = leaveMessage.channel_id;
		const channel = await member.guild.channels.fetch(channelId).catch(() => null);

		if (!channel) {return;}

		leaveMessage = leaveMessage.message
			.replace('{user}', `${member.user.username}`)
			.replace('{server}', member.guild.name);

		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle(`${member.user.username} has left`)
			.setDescription(leaveMessage)
			.setThumbnail(member.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

		channel.send({ embeds:[embed] }).catch(error => { console.error(`GuildMemberRemove: ${error.message}`); });
	},
};
