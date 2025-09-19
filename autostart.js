const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function startBot() {
	const bot = spawn('node', ['index.js']);
	const logFile = `logs/log${getTimestamp()}.txt`;
	const logDir = path.join(__dirname, 'logs');

	if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }

	bot.stdout.on('data', data => {
		const infoLog = `[INFO] ${getTimestamp()} - ${data}`;
		fs.appendFileSync(logFile, infoLog);
		process.stdout.write(infoLog);
	});

	bot.stderr.on('data', data => {
		const errorLog = `[ERROR] ${getTimestamp()} - ${data}`;
		fs.appendFileSync(logFile, errorLog);
		process.stderr.write(errorLog);
	});

	bot.on('close', code => {
		console.log(`Bot exited with code ${code}. Restarting in 5 seconds...`);
		setTimeout(startBot, 5000);
	});
}

function getTimestamp() {
	const now = new Date();

	const pad = n => n.toString().padStart(2, '0');

	const YY = pad(now.getFullYear() % 100);
	const MM = pad(now.getMonth() + 1);
	const DD = pad(now.getDate());
	const HH = pad(now.getHours());
	const mm = pad(now.getMinutes());
	const SS = pad(now.getSeconds());

	return `${YY}.${MM}.${DD}-${HH}.${mm}.${SS}`;
}

startBot();