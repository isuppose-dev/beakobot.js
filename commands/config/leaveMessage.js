const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leavemessage')
		.setDescription('set up a leave message ')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('channel for the message')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('message to send, use {user} for the user and {server} for the server name')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const leaveMessage = interaction.options.getString('message') ?? '{user} has left {server}';
		const channel = interaction.options.getChannel('channel');
		const leaveMessageModel = interaction.client.models.leaveMessage;

		leaveMessageModel.upsert({
			guild_id: interaction.guild.id,
			message: leaveMessage,
			channel_id: channel ? channel.id : null,
		});

		await interaction.reply({ content: `Leave message set to "${leaveMessage}" in ${channel}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`leaveMessage.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});;
	},
};