const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageBulkDelete,
	async execute(messages) {
		const message = messages.first();
		if (!message) return;
		const messageAuditModel = message.client.models.messageAudit;
		const messageAudit = await messageAuditModel.findOne({ where: { guild_id : message.guild.id } });
		if (!messageAudit || !messageAudit.deleted_channel_id || messageAudit.deleted_channel_id === '0') {return;}
		const channel = await message.guild.channels.fetch(messageAudit.deleted_channel_id);

		if (channel) {
			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle('Messages Purged')
				.setDescription(`${messages.size} messages deleted`)
				.setThumbnail(message.client.user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));
			channel.send({ embeds:[embed] }).catch(error => { console.error(`MessageBulkDelete: ${error.message}`); });
		}
	},
};
