'use strict';
//create instance of a Discord Client 
const Discord = require('discord.js');
const bot = new Discord.Client();

//import settings from config.json
const config = require('./src/core/config/init-config.js').init();
const prefix = config.command_prefix;

//initialize command modules
const commands = 
	{
		ping: require('./src/modules/ping.js').process,
		rename: require('./src/modules/rename.js').process
	};

bot.on('ready', () => console.log('Ready!'));

bot.on('message', msg => {
	//store message data for quick access
	const input = msg.content;
	const sender = msg.author;
	const server = msg.guild;
	const channel = msg.channel;

	if (!input.startsWith(prefix)) return;
	if (channel.type !== 'text') return;
	if (sender.bot) return;

	if (input.startsWith(prefix + 'rename') || input.startsWith(prefix + 'rn')) {
		commands.rename(input, server.channels)
			.then(output => channel.sendMessage(output))
			.catch(err => channel.sendMessage(err));	
	}

	else if (input.startsWith(prefix + 'ping')) {
		commands.ping()
			.then(output => channel.sendMessage(output));
	} 
});

//attempt login
if (config.token)
	bot.login(config.token);
else {
	console.log('Discord bot login token required to proceed. Please include one in your config.json.');
	process.exitCode = 1;
}
