const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const folderPath = path.join(__dirname, 'resources');
const filesToDownload = JSON.parse(fs.readFileSync(path.join(__dirname, 'resources.json'), 'utf8'));

if (!fs.existsSync(folderPath)) {
	fs.mkdirSync(folderPath);
	console.log(`Created folder: ${folderPath}`);
}

(async () => {
	for (const file of filesToDownload) {
		const destPath = path.join(folderPath, file.filename);

		if (fs.existsSync(destPath)) {
			console.log(`Skipped: ${file.filename}`);
			continue;
		}

		try {
			await downloadFile(file.url, destPath);
		}
		catch (err) {
			console.error(`Error downloading ${file.filename}:`, err.message);
		}
	}
})();

function downloadFile(fileUrl, destPath) {
	return new Promise((resolve, reject) => {
		const urlObj = new URL(fileUrl);
		const protocol = urlObj.protocol === 'https:' ? https : http;

		const request = protocol.get(fileUrl, response => {
			if (response.statusCode !== 200) {
				return reject(new Error(`Failed to get '${fileUrl}' (${response.statusCode})`));
			}

			const fileStream = fs.createWriteStream(destPath);
			response.pipe(fileStream);

			fileStream.on('finish', () => {
				fileStream.close();
				console.log(`Downloaded: ${destPath}`);
				resolve();
			});
		});

		request.on('error', err => {
			reject(err);
		});
	});
}