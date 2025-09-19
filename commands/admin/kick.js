const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kick')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('user to kick')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('reason for kick'))
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const user = await interaction.options.getUser('user');
		const reason = await interaction.options.getString('reason') ?? 'No Reason Specified';
		let member;
		try {
			member = await interaction.guild.members.fetch(user.id);
		}
		catch (error) {
			interaction.reply({ content:'Unable to kick user.', flags: MessageFlags.Ephemeral });
			return console.error(`kick.js: ${error.message}`);
		}

		if (user.id === interaction.client.user.id) {
			return interaction.reply({ content: 'I\'m not leaving, in fact!', ephemeral: true });
		}

		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle(`Kicked ${user.username}`)
			.setDescription(reason)
			.setThumbnail(user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

		try {
			await interaction.reply({ embeds: [embed] });
			await member.kick({ reason: reason });
		}
		catch (error) {
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
			console.error(`kick.js: ${error.message}`);
		}
	},
};