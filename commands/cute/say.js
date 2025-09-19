const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Say something')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName('message')
				.setDescription('say this')
				.setRequired(true))
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const reply = interaction.options.getString('message') ?? '';
		try {
			if (reply.trim() === '') {
				return await interaction.reply({ content: 'Add a message dumbass', flags: MessageFlags.Ephemeral });
			}
			await interaction.reply({ content: '準備中...', flags: MessageFlags.Ephemeral });
			await interaction.deleteReply();

			await interaction.channel.send(reply);
		}
		catch (error) {
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
			console.error(`say.js: ${error.message}`);
		}
	},
};