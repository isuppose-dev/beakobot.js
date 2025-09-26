const { Events } = require('discord.js');
const shinobruhUrl = 'resources/shinobruh.jpg';
const axios = require('axios');
const cheerio = require('cheerio');
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36';
const fs = require('fs');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.guild) return;

		if (message.author.bot) return;

		const toggleFeatureModel = message.client.models.toggleFeature;
		const funToggleModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'fun' } });
		let funToggle = false;
		if (funToggleModel != null) {
			if (funToggleModel.enabled) {funToggle = true;}
		}

		if (funToggle) {
			if (Math.random() < 0.01) {
				if (message.author.tag != process.env.ISUPPOSE) {
					await message.react('🤓').catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
			}

			if (message.content.toLowerCase().match(/\bi suppose\b/)) {
				await message.channel.send('You said the thing dude!!!!!').catch(error => { console.error(`MessageCreate: ${error.message}`); });
			}

			if (message.content.toLowerCase().includes('bruh')) {
				const emojis = await message.guild.emojis.fetch();
				const breaking_bruh = emojis.find(e => e.name === 'breaking_bruh');
				if (fs.existsSync(shinobruhUrl) && Math.random() < 0.1) {
					message.channel.send({ files: [shinobruhUrl] }).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
				else if (breaking_bruh) {
					message.channel.send(`${breaking_bruh}`).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
			}

			if (message.content.toLowerCase().includes('frotnite')) {
				const petergold = message.guild.emojis.cache.find(e => e.name === 'petergold');
				if (petergold) {
					message.react(petergold).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
			}
		}

		const autoembedToggleModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'autoembed' } });
		let autoembedToggle = false;
		if (autoembedToggleModel != null) {
			if (autoembedToggleModel.enabled) {autoembedToggle = true;}
		}

		if (autoembedToggle) {
			// custom embeds when websites suck
			const twitterRegex = /https?:\/\/(x|twitter)\.com\/[^/]+\/status\/(\d+)/;
			const twitterMatch = message.content.match(twitterRegex);
			const FxEmbedUrl = 'https://fxtwitter.com';
			const FxAPIurl = 'https://api.fxtwitter.com';
			const iFunnyRegex = /https?:\/\/(?:www\.)?ifunny\.co\/(meme|gif|picture|video)\/([a-zA-Z0-9]+)/i;
			const iFunnyMatch = message.content.match(iFunnyRegex);

			if (twitterMatch && !isSpoilered(message.content, twitterMatch)) {
				const tweetId = twitterMatch[2];

				let res, data;
				try {
					res = await axios.get(`${FxAPIurl}/i/status/${tweetId}`, { headers: { 'User-Agent': userAgent } });
					data = res.data;
				}
				catch (error) {
					return console.error(`MessageCreate: ${error.message}`);
				}

				const photos = data.tweet.media?.photos || [];
				const videos = data.tweet.media?.videos || [];

				// 1 Photo exists, isnt embedding (1 photo and it embeds who cares)
				if (photos.length === 1) {
					await new Promise(resolve => setTimeout(resolve, 1500));
					const fetchedMessage = await message.channel.messages.fetch(message.id);
					if (fetchedMessage.embeds.length < 1) {
						try {
							const sent = await message.reply({ content: `[@${data.tweet.author.name}](${data.tweet.author.url})\n${data.tweet.text}`, files: [photos[0].url] });
							const fetched = await message.channel.messages.fetch(sent.id);
							await message.suppressEmbeds(true);
							await fetched.suppressEmbeds(true);
						}
						catch (error) { console.error(`MessageCreate: ${error.message}`); }
					}
				}
				// Multiple photos
				else if (photos.length > 1) {
					const photoUrls = photos.map(photo => photo.url);
					try {
						const sent = await message.reply({ content: `[@${data.tweet.author.name}](${data.tweet.author.url})\n${data.tweet.text}`, files: photoUrls });
						const fetched = await message.channel.messages.fetch(sent.id);
						await message.suppressEmbeds(true);
						await fetched.suppressEmbeds(true);
					}
					catch (error) { console.error(`MessageCreate: ${error.message}`); }

				}
				// Embed video
				else if (videos.length > 0) {
					try {
						const sent = await message.reply({ content: `[@${data.tweet.author.name}](${data.tweet.author.url})\n${data.tweet.text}`, files: [videos[0].url] });
						const fetched = await message.channel.messages.fetch(sent.id);
						await message.suppressEmbeds(true);
						await fetched.suppressEmbeds(true);
					}
					catch (error) { console.error(`MessageCreate: ${error.message}`); }
				}
				else if (data.tweet.text.length > 280) {
					message.reply(`${FxEmbedUrl}/i/status/${tweetId}`).catch(error => { console.error(`MessageCreate: ${error.message}`); });
					message.suppressEmbeds(true).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
			}
			else if (iFunnyMatch && !isSpoilered(message.content, iFunnyMatch)) {
				const type = iFunnyMatch[1];
				const ifunnyContentUrl = `${message.content}`;
				const res = await axios.get(ifunnyContentUrl, { headers: { 'User-Agent': userAgent, 'Ifunny-Project-Id' : 'iFunny', 'authorization' : 'guest' } });
				const $ = cheerio.load(res.data);

				if (type === 'meme' || type === 'picture') {
					const imageUrl = $('meta[property="og:image"]').attr('content');
					message.reply({ files: [imageUrl] }).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
				else if (type === 'video') {
					const videoUrl = $('meta[property="og:video:url"]').attr('content');
					message.reply({ files: [videoUrl] }).catch(error => { console.error(`MessageCreate: ${error.message}`); });
				}
				// iFunny fakes gifs and hides them in the html
				else if (type === 'gif') {
					const gifMatch = res.data.match(/https:\/\/img\.ifunny\.co\/images\/[^\s"']+\.mp4/i);
					if (gifMatch) {
						message.reply({ content: 'pretend this is a gif', files: [gifMatch[0]] }).catch(error => { console.error(`MessageCreate: ${error.message}`); });
					}
				}
			}
		}

		const messageRoleToggleModel = await toggleFeatureModel.findOne({ where: { guild_id: message.guild.id, feature: 'messagerole' } });
		let messageRoleToggle = false;
		if (messageRoleToggleModel != null) {
			if (messageRoleToggleModel.enabled) {messageRoleToggle = true;}
		}
		if (messageRoleToggle) {
			const messageRoleModel = message.client.models.messageRole;
			const guildMessageRoles = await messageRoleModel.findAll({
				where: { guild_id: message.guild.id } });

			const textMatchRoles = guildMessageRoles.filter(role => message.content.includes(role.text));
			const filteredRoles = textMatchRoles.filter(row => {
				if (row.channel_id != null && row.channel_id != message.channel.id) return false;
				if (row.is_strict === true) {
					const escapedText = row.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  					const regex = new RegExp(`\\b${escapedText}\\b`, 'i');
					if (!regex.test(message.content.toLowerCase())) {return false;}
				}
				return true;
			});

			try {
				filteredRoles.forEach(role => {
					message.member.roles.add(role.role_id);
				});
			}
			catch (error) {
				console.log(error);
			}
		}
	},
};

function isSpoilered(content, match) {
	const spoilerRegex = /\|\|.*?\|\|/g;
	const spoilers = content.match(spoilerRegex);
	if (!spoilers) return false;
	return spoilers.some(spoiler => spoiler.includes(match[0]));
}