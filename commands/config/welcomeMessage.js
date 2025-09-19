const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcomemessage')
		.setDescription('set up a welcome message ')
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
		const welcomeMessage = interaction.options.getString('message');
		const channel = interaction.options.getChannel('channel');
		const welcomeMessageModel = interaction.client.models.welcomeMessage;

		welcomeMessageModel.upsert({
			guild_id: interaction.guild.id,
			message: welcomeMessage,
			channel_id: channel ? channel.id : null,
		});

		await interaction.reply({ content: `Welcome message set to "${welcomeMessage}" in ${channel}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`welcomeMessage.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};