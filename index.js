'use strict';
//create instance of a Discord Client 
const Discord = require('discord.js');
const bot = new Discord.Client();

//import settings from config.json
const config = require('./src/init-config.js').init();
const prefix = config.command_prefix;

//initialize command modules
//(to do: abstract this)
const Ping = require('./src/modules/commands/ping.js');
const Rename = require('./src/modules/commands/rename.js');
const commands = [new Ping(), new Rename()];

bot.on('ready', () => console.log('Ready!'));

bot.on('message', msg => {
	//store message data for quick access
	const input = msg.content;
	const channel = msg.channel;

	if (!input.startsWith(prefix)) return;
	if (channel.type !== 'text') return;
	if (msg.author.bot) return;
	
	//format input
	const cmd = input.split(' ')[0].slice(prefix.length);
	const args = input.slice(prefix.length+cmd.length).trim();

	for (let c of commands) {
		if (c.validate(cmd)) {
			c.process(msg, cmd, args)
				.then(output => channel.sendMessage(output))
				.catch(err => channel.sendMessage(err));
		}
	}
});

//attempt login
if (config.token)
	bot.login(config.token);
else {
	console.log('Discord bot login token required to proceed. Please include one in your config.json.');
	process.exitCode = 1;
}
