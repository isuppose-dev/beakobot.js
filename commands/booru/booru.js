const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, InteractionContextType } = require('discord.js');
const Booru = require('booru');

module.exports = {
	cooldown : 6,
	data: new SlashCommandBuilder()
		.setName('booru')
		.setDescription('booru search')
		.addStringOption(option =>
			option.setName('tags')
				.setDescription('search tags')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('random')
				.setDescription('randomize search')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('rating')
				.setDescription('rating')
				.setRequired(false)
				.addChoices(
					{ name: 'safe', value: 'rating:safe' },
					{ name: 'questionable', value: 'rating:questionable' },
					{ name: 'explicit', value: 'rating:explicit' }))
		.addStringOption(option =>
			option.setName('booru')
				.setDescription('booru to search from')
				.setRequired(false)
				.addChoices(
					{ name: 'safebooru.org', value: 'sb' },
					{ name: 'danbooru.org', value: 'db' },
				))
		.setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel, InteractionContextType.BotDM),
	async execute(interaction) {
		const tags = interaction.options.getString('tags').split(' ') ?? [];
		const random = interaction.options.getBoolean('random') ?? false;
		const rating = interaction.options.getString('rating') ?? 'rating:safe';
		let booru = interaction.options.getString('booru') ?? '';
		let index = 0;
		let posts;

		if (interaction.inGuild()) {
			if (!interaction.channel.nsfw && rating != 'rating:safe') {
				return await interaction.reply({ content: 'Can only search for unsafe images in non-NSFW channels', flags: MessageFlags.Ephemeral })
					.catch(error => {console.error(`purge.js: ${error.message}`);});
			}
		}

		if (rating == 'rating:safe' && booru == '') {booru = 'sb';}
		else if (rating != 'rating:safe' && booru == '') {booru = 'db';}
		if (booru != 'sb') {tags.unshift(rating);}

		try {
			await interaction.reply({ content: 'Searching...', flags: MessageFlags.Ephemeral });
			posts = await Booru.search(booru, tags, { limit: 100, random: true });
			if (!posts.length) { return interaction.editReply({ content: 'No results found', flags: MessageFlags.Ephemeral }); }
		}
		catch (error) {
			interaction.reply({ content: error.message });
			return console.error(`booru.js: ${error.message}`);
		}

		const embed = new EmbedBuilder()
			.setColor(Number(process.env.COLOR))
			.setTitle('Booru Search')
			.setImage(posts[index].fileUrl)
			.setURL(posts[index].postView)
			.setFooter({ text: `Tags: ${posts[index].tags.join(', ')}` });

		const row = new ActionRowBuilder();
		if (random) {
			row.addComponents(
    		new ButtonBuilder().setCustomId('next').setLabel('🔀').setStyle(ButtonStyle.Secondary),
			);
		}
		else {
			row.addComponents(
				new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary),
			);
		}

		const message = await interaction.followUp({ embeds: [embed], components: [row] });
		const collector = message.createMessageComponentCollector({ time: 60000 });

		try {
			if (random) {
				collector.on('collect', async i => {
					if (i.user.id !== interaction.user.id) return i.followUp({ content: 'Not your session.', flags: MessageFlags.Ephemeral });
					const newPosts = await Booru.search(booru, tags, { limit: 25, random: true });
					const newPost = newPosts[Math.floor(Math.random() * newPosts.length)];

					if (!newPost) { return i.update({ content: 'No more results found.', embeds: [], components: [] }); }

					const newEmbed = new EmbedBuilder()
						.setTitle('Random Booru Image')
						.setImage(newPost.fileUrl)
						.setURL(newPost.postView)
						.setFooter({ text: `Tags: ${newPost.tags.join(', ')}` });

					await i.update({ embeds: [newEmbed] });

					collector.resetTimer();
				});
			}
			else {
				collector.on('collect', async i => {
					if (i.user.id !== interaction.user.id) return i.followUp({ content: 'Not your session.', flags: MessageFlags.Ephemeral });

					if (i.customId === 'next') index = (index + 1) % posts.length;
					if (i.customId === 'prev') index = (index - 1 + posts.length) % posts.length;

					const newEmbed = EmbedBuilder.from(embed)
						.setTitle(`Result ${index + 1} of ${posts.length}`)
						.setImage(posts[index].fileUrl)
						.setURL(posts[index].postView)
						.setFooter({ text: posts[index].tags.join(', ') });

					await i.update({ embeds: [newEmbed] });
					collector.resetTimer();
				});
			}
		}
		catch (error) {
			await interaction.followUp({ content: error.message });
			console.error(`booru.js: ${error.message}`);
			return;
		}
	},
};