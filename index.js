// import the discord.js module
const Discord = require('discord.js');
//create instance of a Discord Client 
const bot = new Discord.Client();
//bot token
const token = '';

bot.on('ready', () => {
	console.log('I am ready!');
});

bot.on('message', msg => {
	let prefix = '>',
	input = msg.content,
	sender = msg.author,
	channel = msg.channel;

	/* 
		Exit and stop if message doesn't start with prefix
		or if the message sender is another bot.
	*/
	if(!input.startsWith(prefix)) return;
	if(sender.bot) return;

	if (input.startsWith(prefix + 'rename')) {				
		input = input.replace(prefix + 'rename ', ''); //trim away command

		let quotePattern = /".*?"/,
		validCharacterPattern = /^[a-zA-Z0-9_-]+$/;
		
		//check for first argument
		if (quotePattern.test(input)) { 
			try {
				let query = (quotePattern.exec(input))[0].replace(/"/g,''),			
				match = bot.channels.find('name', query); //find and store corresponding channel
				input = input.substring(query.length+2); //trim away first argument			

				//check for second argument
				if (quotePattern.test(input)) {
					let name = (quotePattern.exec(input))[0].replace(/"/g,'');
					//check to make sure desired name fits discord's naming criteria
					if (name.length < 2 || name.length > 100) 
						channel.sendMessage('Channel names must be between 2-100 characters long.'); 
					else if (match.type === 'text' && !validCharacterPattern.test(name))
						channel.sendMessage(
							'Text channel names must be alphanumeric with dashes or underscores.');
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

bot.login(token);