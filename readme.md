# **BeakoBot**

## Setup
do all the stuff you need in 
https://discord.com/developers/applications

**Enable the following:**

- Installation
	- Installation Contexts  
		- User Install  
		- Guild Install
	- Install Link
		- Discord Provided Link
	- Default Install Settings
		- User Install
			- Scopes
				- applications.commands
		- Guild Install
			- Scopes
				- applications.commands
				- bot
			- Premissions
				- Administrator

- OAuth2
	- Client information
		- Client Secret
			- need to put this in DISCORD_TOKEN in .env

- Bot
	- Authorization Flow
		- Public Bot
	- Privileged Gateway Intents
		- Presence Intent
		- Server Members Intent
		- Message Content Intent

do this in the bot directory:

	npm install
	node deploy-commands.js
	node download-resources.js
	node dbInit.js

To start the bot use

	node autostart.js

as this will restart the bot on crash, otherwise use

	node .

[isuppose](https://isuppose.net/)