const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('joinrole')
		.setDescription('set up a join role')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('role to give')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('delete')
				.setDescription('if a previous existing join role should be deleted')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const deleteRole = interaction.options.getBoolean('delete');
		const joinRoleModel = interaction.client.models.joinRole;

		if (deleteRole) {
			joinRoleModel.destroy({
				where: {
					guild_id: interaction.guild.id,
					role_id : role.id,
				},
			});

			return await interaction.reply({ content: `Deleted join role ${role}`, flags: MessageFlags.Ephemeral }).catch(error => {
				console.log(error);
				interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
			});
		}

		joinRoleModel.upsert({
			guild_id: interaction.guild.id,
			role_id : role.id,
		});

		await interaction.reply({ content: `Join role created for role ${role}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`joinRole.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};