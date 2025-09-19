const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, InteractionContextType } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactrole')
		.setDescription('set up a reaction role')
		.addStringOption(option =>
			option.setName('messageid')
				.setDescription('message to watch reactions on')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('channel the message is in')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('role for the reaction (will overwrite previous role if exists for same emoji)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('emoji for the reaction')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const reactionRoleModel = interaction.client.models.reactionRole;
		const message_id = interaction.options.getString('messageid');
		const channel = interaction.options.getChannel('channel');
		const role = interaction.options.getRole('role');
		const emojiString = interaction.options.getString('emoji');
		const emojiName = emojiString.match(/^<a?:([\w]+):(\d{18,})>$/);

		let message;
		try {
			message = await channel.messages.fetch(message_id);
			if (!message) {return await interaction.reply({ content: `bad message: ${message_id} (not in right channel?)`, flags: MessageFlags.Ephemeral });}
		}
		catch {
			return await interaction.reply({ content: `bad message: ${message_id} (ex:1097641586340413450)`, flags: MessageFlags.Ephemeral });
		}

		let emoji;
		try {
			if (/\p{Emoji}/u.test(emojiString)) {
				emoji = emojiString;
			}
			else if (/^<a?:\w+:\d{18,}>$/.test(emojiString)) {
				emojiCollection = await interaction.guild.emojis.fetch();
				emoji = emojiCollection.find(e => e.name === emojiName[1] && e.id === emojiName[2]);

				if (!emoji) {
					return await interaction.reply({ content: `emoji must be in this server, bad emoji: ${emojiString} (are you using a similar emoji from a different server?)`, flags: MessageFlags.Ephemeral });
				}
			}
			else {return await interaction.reply({ content: `bad emoji: ${emojiString}`, flags: MessageFlags.Ephemeral });}

		}
		catch {
			return await interaction.reply({ content: `bad emoji: ${emojiString}`, flags: MessageFlags.Ephemeral });
		}

		reactionRoleModel.upsert({
			guild_id: interaction.guild.id,
			message_id: message_id,
			channel_id: channel.id,
			emoji_id: emojiString,
			role_id: role.id,
		});

		const messageLink = `https://discord.com/channels/${interaction.guild.id}/${channel.id}/${message_id}`;
		await message.react(emoji);
		await interaction.reply({ content: `React role added to ${messageLink} with emoji ${emoji} for role ${role}`, flags: MessageFlags.Ephemeral }).catch(error => {
			console.error(`reactionRole.js: ${error.message}`);
			interaction.reply({ content: error.message, flags: MessageFlags.Ephemeral });
		});
	},
};