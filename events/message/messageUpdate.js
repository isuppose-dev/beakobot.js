const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
		if (oldMessage.content != newMessage.content) {
			if (oldMessage.partial) {
				try {
					await oldMessage.fetch();
				}
				catch (error) {
					console.warn('Could not fetch old message:', error);
					return;
				}
			}

			const messageAuditModel = oldMessage.client.models.messageAudit;
			const messageAudit = await messageAuditModel.findOne({ where: { guild_id : oldMessage.guild.id } });
			if (!messageAudit || !messageAudit.edited_channel_id || messageAudit.edited_channel_id === '0') {return;}
			const channel = await oldMessage.guild.channels.fetch(messageAudit.edited_channel_id);
			if (channel) {
				const embed = new EmbedBuilder()
					.setColor(Number(process.env.COLOR))
					.setTitle(`${newMessage.author.username} Edited Message`)
					.setDescription(`Old: ${oldMessage.content ?? '[Not Cached]'} \nNew: ${newMessage.content}`)
					.setThumbnail(newMessage.author.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));
				channel.send({ embeds:[embed] }).catch(error => { console.error(`messageUpdate: ${error.message}`); });
			}
		}
	},
};
