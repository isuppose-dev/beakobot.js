const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('unban a user')
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('ID of the user to unban')
				.setRequired(true)
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('reason for the unban')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const user = await interaction.options.getString('userid');
		const reason = await interaction.options.getString('reason') ?? 'No Reason Specified';


		try {
			const bannedUser = await interaction.client.users.fetch(user);

			const embed = new EmbedBuilder()
				.setColor(Number(process.env.COLOR))
				.setTitle(`Unbanned ${bannedUser.username}`)
				.setDescription(reason)
				.setThumbnail(bannedUser.displayAvatarURL({ format: 'png', size: 128, dynamic: true }));;

			await interaction.guild.bans.remove(user, reason);
			await interaction.reply({ embeds:[embed] });
		}
		catch (error) {
			await interaction.reply({ content: `Error: ${error.message}`, flags: MessageFlags.Ephemeral });
			console.error(`unban.js: ${error.message}`);
		}
	},

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const bans = await interaction.guild.bans.fetch();

		const choices = bans
			.filter(ban => ban.user.username.toLowerCase().includes(focusedValue.toLowerCase()))
			.map(ban => ({
				name: `${ban.user.username}#${ban.user.discriminator}`,
				value: ban.user.id,
			}))
			.slice(0, 25);

		await interaction.respond(choices).catch(error => {console.error(`unban.js: ${error.message}`);});
	},
};