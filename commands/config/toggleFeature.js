const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('togglefeature')
		.setDescription('enable/disable features')
		.addStringOption(option =>
			option.setName('feature')
				.setDescription('feature to edit')
				.setRequired(true)
				.addChoices(
					{ name: 'fun', value: 'fun' },
					{ name: 'autoembed', value: 'autoembed' },
					{ name: 'welcome message', value: 'welcome' },
					{ name: 'leave message', value: 'leave' },
					{ name: 'message role', value: 'messagerole' },
					{ name: 'join role', value: 'joinrole' },
				))
		.addBooleanOption(option =>
			option.setName('enabled')
				.setDescription('enable or disable the feature')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const feature = interaction.options.getString('feature');
		const enabled = interaction.options.getBoolean('enabled');
		const toggleFeatureModel = 	interaction.client.models.toggleFeature;

		toggleFeatureModel.upsert({
			guild_id: interaction.guild.id,
			feature: feature,
			enabled: enabled,
		});

		await interaction.reply({ content: `${feature} has been ${enabled ? 'enabled' : 'disabled'}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`toggleFeature.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};