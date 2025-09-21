const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
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
		const toggleFeatureModel = member.client.models.toggleFeature;

		welcomeMessageBlock: {
			const welcomeMessageModel = member.client.models.welcomeMessage;
			let welcomeMessage = await welcomeMessageModel.findOne({ where: { guild_id: member.guild.id } });
			const welcomeToggle = await toggleFeatureModel.findOne({ where: { guild_id: member.guild.id, feature: 'welcome' } });

			if (!welcomeMessage || !welcomeMessage.channel_id || !welcomeToggle || !welcomeToggle.enabled) {break welcomeMessageBlock;}

			const channelId = welcomeMessage.channel_id;
			const channel = await member.guild.channels.fetch(channelId).catch(() => null);

			if (!channel) {break welcomeMessageBlock;}

			welcomeMessage = welcomeMessage.message
				.replace('{user}', `${member.user.username}`)
				.replace('{server}', member.guild.name);

			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle(`${member.user.username} has joined`)
				.setDescription(welcomeMessage)
				.setThumbnail(member.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));
			channel.send({ embeds:[embed] }).catch(error => { console.error(`GuildMemberAdd: ${error.message}`); });
		}

		{
			const joinRoleModel = member.client.models.joinRole;
			joinRoles = await joinRoleModel.findAll({ where: { guild_id: member.guild.id } });
			try {
				joinRoles.forEach(role => {
					member.roles.add(role.role_id);
				});
			}
			catch (error) { console.error(`GuildMemberAdd: ${error.message}`); }
		}

	},
};
