const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js');
const fs = require('fs');
const delay = 2000;
const ubwUrl = 'resources/Emiya.mp4';

module.exports = {
	cooldown : 60,
	data: new SlashCommandBuilder()
		.setName('ubw')
		.setDescription('無限の剣製')
		.setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone)
		.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		const channel = interaction.channel;

		try {
			await interaction.reply({ content: '準備中...', flags: MessageFlags.Ephemeral });
			interaction.deleteReply();

			channel.send('I am the bone of my sword.');
			await sleep(delay);
			channel.send('Steel is my body and fire is my blood.');
			await sleep(delay);
			channel.send('I have created over a thousand blades.');
			await sleep(delay);
			channel.send('Unknown to death, nor known to life.');
			await sleep(delay);
			channel.send('Have withstood pain to create many weapons.');
			await sleep(delay);
			channel.send('Yet, those hands will never hold anything.');
			await sleep(delay);
			channel.send('So as I pray--');
			await sleep(delay);
			channel.send('# Unlimited Blade Works');
			if (fs.existsSync(ubwUrl)) {
				await sleep(delay);
				channel.send({ files: [ubwUrl] });
			}
		}
		catch (error) { console.error(`ubw.js: ${error.message}`); }
	},
};

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}