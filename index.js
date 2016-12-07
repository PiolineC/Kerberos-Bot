'use strict';
//create instance of a Discord Client 
const Discord = require('discord.js'),
bot = new Discord.Client();

//import settings from config.json
const config = require('./init-config.js').init();

//initialize command modules
const commands = 
	{
		rename: require('./rename.js').process
	};

bot.on('ready', () => {
	console.log('Ready!');
});

bot.on('message', msg => {
	const prefix = config.command_prefix,	
	input = msg.content,
	sender = msg.author,
	channel = msg.channel;

	//Exit and stop if message doesn't start with prefix
	//or if the message sender is a bot.
	if(!input.startsWith(prefix)) return;
	if(sender.bot) return;

	if (input.startsWith(prefix + 'rename') || input.startsWith(prefix + 'rn')) {	
		commands.rename(bot, channel, input);	
	} 
});

if (config.token)
	bot.login(config.token);
else {
	console.log(
		'Discord bot login token required to proceed. Please include one in your config.json.')
	process.exitCode = 1;
}
