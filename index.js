'use strict';
//create instance of a Discord Client 
const Discord = require('discord.js');
const bot = new Discord.Client();

//import settings from config.json
const config = new (require('./src/core/config/config.js'))('../../../config.json');		
const loginToken = config.get('token');
const prefix = config.get('prefix');

//initialize command modules
const CommandFinder = require("./src/core/discovery/command-finder.js");
const commands = CommandFinder.getCommands(config);

const Help = new (require('./src/modules/commands/help.js'))(prefix, commands);
const commandList = Help.descriptionText;

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

	if (cmd === 'help') {
		if (Help.generateHelpText(args)) 
			return channel.sendMessage(Help.generateHelpText(args));
		return channel.sendMessage(commandList);
	}

	for (let i of commands) {
		if (i.trigger(cmd)) {
			i.execute(msg, args)
				.then(output => channel.sendMessage(output))
				.catch(err => channel.sendMessage(err + `\nType ${prefix}help for more information on how to use a command.`));
		}
	}
});

//attempt login
if (loginToken)
	bot.login(loginToken);
else {
	console.error('ERROR: Discord bot login token required to proceed. Please include one in your config.json.');
	process.exitCode = 1;
}
