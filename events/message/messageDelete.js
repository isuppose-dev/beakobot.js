const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {

		if (message.partial) {
			try {
				await message.fetch();
			}
			catch (error) {
				console.error('Failed to fetch partial message:', error);
				return;
			}
		}

		const messageAuditModel = message.client.models.messageAudit;
		const messageAudit = await messageAuditModel.findOne({ where: { guild_id : message.guild.id } });
		if (!messageAudit || !messageAudit.deleted_channel_id || messageAudit.deleted_channel_id === '0') {return;}
		if (message.author.id === message.client.user.id) {return;}
		const channel = await message.guild.channels.fetch(messageAudit.deleted_channel_id);


		if (channel) {
			const content = message.content ?? '[No content]';
			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle('Deleted Message')
				.setDescription(content)
				.setThumbnail(message.author.displayAvatarURL({ format: 'png', size: 128, dynamic: true }))
				.setFooter({ text:`${message.author.username}` });
			channel.send({ embeds:[embed] }).catch(error => { console.error(`MessageDelete: ${error.message}`); });
		}
	},
};
