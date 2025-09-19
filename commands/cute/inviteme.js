const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inviteme')
		.setDescription('Replies with the bot invite link')
		.setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel, InteractionContextType.BotDM),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle('Invite me to your server I suppose')
			.setDescription('You can also add me as an app, in fact!')
			.setURL(`https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}`)
			.setThumbnail(interaction.client.user.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));

		await interaction.reply({ embeds:[embed] }).catch(error => {
			console.error(`inviteme.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};