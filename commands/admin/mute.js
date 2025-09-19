const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('mute a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('who to mute')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('minutes')
				.setDescription('minutes to mute the user')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('reason for the mute')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const user = await interaction.options.getUser('user');
		const member = await interaction.guild.members.fetch(user.id);
		const reason = await interaction.options.getString('reason') ?? 'No Reason Specified';
		const duration = await interaction.options.getInteger('duration') ?? 60;

		if (user.id === interaction.client.user.id) {
			return interaction.reply({ content: 'I\'m not shutting up, in fact!', ephemeral: true });
		}

		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle(`Muted ${user.username}`)
			.setDescription(reason)
			.setThumbnail(user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }))
			.setFooter({ text: `Muted for ${ duration } minutes` });

		try {
			await member.timeout(duration * 60 * 1000, reason);
			await interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
			console.error(`mute.js: ${error.message}`);
		}
	},
};