const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const banvidUrl = 'resources/banvid.mp4';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('who to ban')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('reason for the ban')
				.setRequired(false))
		.addIntegerOption(option =>
			option.setName('delete-message-days')
				.setDescription('days back to delete messages for')
				.setRequired(false)
				.setMinValue(0)
				.setMaxValue(14))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),

	/** @param {CommandInteraction} interaction */
	async execute(interaction) {
		const user = await interaction.options.getUser('user');
		const member = await interaction.guild.members.fetch(user.id);
		const reason = await interaction.options.getString('reason') ?? 'No Reason Specified';
		const deleteMessageDays = await interaction.options.getInteger('delete-message-days') ?? 0;

		const toggleFeatureModel = interaction.client.models.toggleFeature;
		const funToggleModel = await toggleFeatureModel.findOne({ where: { guild_id: interaction.guild.id, feature: 'fun' } });
		let funToggle = false;

		if (user.id === interaction.client.user.id) {
			return interaction.reply({ content: 'I\'m not leaving, in fact!', ephemeral: true });
		}

		if (funToggleModel != null) {
			if (funToggleModel.enabled) {funToggle = true;}
		}

		try {
			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle(`Banned ${user.username}`)
				.setDescription(reason)
				.setThumbnail(user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

			if (deleteMessageDays > 0) {
				embed.setFooter({ text: `Deleting messages from up to ${deleteMessageDays} days ago` });
			}

			await interaction.reply({ embeds: [embed] });

			if (funToggle === true && fs.existsSync(banvidUrl)) {
				interaction.followUp({ files: [banvidUrl] });
			}

			await member.ban({ reason: reason, deleteMessageSeconds: deleteMessageDays * 86400 });

		}
		catch (error) {
			await interaction.followUp({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
			console.error('ban.js: error.message');
		}
	},
};