const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {
		if (user.bot || !reaction.message.guild) return;

		if (reaction.partial) await reaction.fetch();
  		if (reaction.message.partial) await reaction.message.fetch();

		const guild = reaction.message.guild;
		const emoji = reaction.emoji;

		const fullEmoji =
			emoji.id && emoji.name
				? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
				: emoji.name;

		const reactionRoleModel = reaction.client.models.reactionRole;
		const reactionRole = await reactionRoleModel.findOne(
			{ where:
				{ 	guild_id: guild.id,
					channel_id: reaction.message.channel.id,
					message_id: reaction.message.id,
					emoji_id: fullEmoji,
				 } });

		if (!reactionRole) return;

		const member = await guild.members.fetch(user.id);
		const roles = await reaction.message.guild.roles.fetch();
		const role = roles.find(r => r.id === reactionRole.role_id);
		if (!role) return;

		await member.roles.add(role).catch(error => { console.error(`messageReactionAdd: ${error.message}`); });
	},
};
