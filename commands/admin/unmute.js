const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('unmute a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('who to unmute')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const user = await interaction.options.getUser('user');
		const member = await interaction.guild.members.fetch(user.id);
		const reason = await interaction.options.getString('reason') ?? 'No Reason Specified';

		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle(`Unmuted ${user.username}`)
			.setDescription(reason)
			.setThumbnail(user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

		try {
			await member.timeout(1, reason);
			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
			console.error(`unmute.js: ${error.message}`);
		}
	},
};