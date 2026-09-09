const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, ChannelType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('messageauditlog')
		.setDescription('set up message audit logs')
		.addChannelOption(option =>
			option.setName('edited')
				.setDescription('channel to post edited messages')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false))
		.addChannelOption(option =>
			option.setName('deleted')
				.setDescription('channel to post deleted messages')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false))
		.addStringOption(option =>
			option.setName('disable')
				.setDescription('feature to disable')
				.setRequired(false)
				.addChoices(
					{ name: 'edited', value: 'edited' },
					{ name: 'deleted', value: 'deleted' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		let editedChannel = interaction.options.getChannel('edited');
		let deletedChannel = interaction.options.getChannel('deleted');
		const disable = interaction.options.getString('disable');
		const messageAuditModel = interaction.client.models.messageAudit;
		const currentMessageAudit = messageAuditModel.findOne({ where: { guild_id : interaction.guild.id } });

		if (!editedChannel && !deletedChannel && !disable) {
			return interaction.reply({ content: 'You gotta pick something man', flags: MessageFlags.Ephemeral }).catch(error => {
				console.log(error);
				interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
			});
		}

		if (!editedChannel) {editedChannel = currentMessageAudit.edited_channel_id;}
		else {editedChannel = editedChannel.id;}

		if (!deletedChannel) {deletedChannel = currentMessageAudit.deleted_channel_id;}
		else {deletedChannel = deletedChannel.id;}

		if (disable === 'edited') {editedChannel = 0;}
		if (disable === 'deleted') {deletedChannel = 0;}

		messageAuditModel.upsert({
			guild_id: interaction.guild.id,
			edited_channel_id : editedChannel,
			deleted_channel_id: deletedChannel,
		});

		interaction.reply({ content: 'message audit log settings updated', flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`messageAuditLog.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};