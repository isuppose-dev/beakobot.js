const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('purge messages')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('how many messages to purge')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		let amount = interaction.options.getInteger('amount');
		const messages = await interaction.channel.messages.fetch({ limit: amount });
		const filtered = messages.filter(msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

		if (filtered.size === 0) {
			return await interaction.reply({
				content: 'No messages to delete that are younger than 14 days.', flags: MessageFlags.Ephemeral }).catch(error => {console.error(`purge.js: ${error.message}`);});
		}

		try {
			if (filtered.size < amount) {
				amount = filtered.size;
				await interaction.reply({ content: `Only ${filtered.size} message${amount != 1 ? 's' : ''} ${amount != 1 ? 'are' : 'is'} younger than 14 days.`, flags: MessageFlags.Ephemeral });
			}
			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle(`Purged ${amount} message${amount != 1 ? 's' : ''}`)
				.setThumbnail(interaction.client.user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

			await interaction.channel.bulkDelete(filtered, true);
			await interaction.channel.send({ embeds: [embed] });
		}
		catch (error) {
			await interaction.channel.send({ content: `Error: ${error.message}` });
			console.error(`purge.js: ${error.message}`);
		}
	},
};