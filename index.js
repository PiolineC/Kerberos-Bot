'use strict';
//create instance of a Discord Client 
const Discord = require('discord.js'),
bot = new Discord.Client();

//import settings from config.json
let config = require('./init-config.js').initConfig();

bot.on('ready', () => {
	console.log('I am ready!');
});

bot.on('message', msg => {
	let prefix = config.command_prefix,
	input = msg.content,
	sender = msg.author,
	channel = msg.channel;
	 
	//Exit and stop if message doesn't start with prefix
	//or if the message sender is another bot.
	
	if(!input.startsWith(prefix)) return;
	if(sender.bot) return;

	if (input.startsWith(prefix + 'rename')) {	
		let quotePattern = /".*?"/,
		validCharacterPattern = /^[a-zA-Z0-9_-]+$/;
		
		//check for first argument
		if (quotePattern.test(input)) { 
			try {
				let query = (quotePattern.exec(input))[0].replace(/"/g,''),			
				match = bot.channels.find('name', query); //find and store corresponding channel
				//trim away first argument and any leading text
				input = input.substring(input.indexOf(query) + query.length + 2); 

				//check for second argument
				if (quotePattern.test(input)) {
					let name = (quotePattern.exec(input))[0].replace(/"/g,'');
					
					//check to make sure desired name fits discord's naming criteria
					if (name.length < 2 || name.length > 100) 
						channel.sendMessage('Channel names must be between 2-100 characters long.'); 
					else if (match.type === 'text' && !validCharacterPattern.test(name))
						channel.sendMessage(
							'Text channel names must be alphanumeric with dashes or underscores.');
					else if (name === query)
						channel.sendMessage('Channel name is already "' + name + '"!');
					else {
						match.setName(name);
						channel.sendMessage(
							'Channel "' + query + '" successfully renamed to "' + name + '"!');
					}

				//executes if no second argument is found
				} else { channel.sendMessage('Please input your desired name change.'); }

			//executes if parsed channel name doesn't exist
			} catch (err) { channel.sendMessage('Channel not found.'); }

		} else { //executes if no arguments are found
			channel.sendMessage(
				'Please input the channel you wish to rename and your desired name change.');
		}				
	} 
});

if (config.token)
	bot.login(config.token);
else {
	console.log('Discord bot login token required to proceed. Please include one in your config.json.')
	process.exitCode = 1;
}