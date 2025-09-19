const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('messagerole')
		.setDescription('set up a message role')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('text to watch for')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('role to give')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('channel to watch for the message, leave this blank for any channel')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('strict')
				.setDescription('if the message needs to match exactly')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('delete')
				.setDescription('if a previous existing messagerole should be deleted')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const text = interaction.options.getString('text');
		const role = interaction.options.getRole('role');
		const channel = interaction.options.getChannel('channel');
		const strict = interaction.options.getBoolean('strict');
		const deleteRole = interaction.options.getBoolean('delete');
		const messageRoleModel = interaction.client.models.messageRole;

		if (deleteRole) {
			messageRoleModel.destroy({
				where: {
					guild_id: interaction.guild.id,
					text: text,
					role_id : role.id,
				},
			});
			return interaction.reply({ content: `deleted all messageroles for text "${text}" and role ${role}`, flags: MessageFlags.Ephemeral }).catch(error => {
				console.error(`messageRole.js: ${error.message}`);
				interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
			});

		}

		messageRoleModel.upsert({
			guild_id: interaction.guild.id,
			text: text,
			channel_id: channel ? channel.id : null,
			role_id : role.id,
			is_strict : strict ? strict : false,
		});

		interaction.reply({ content: `messagerole created for text "${text}" and role ${role}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.log(error);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};