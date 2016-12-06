/* 
	This command allows users to change voice
	or text channel	names through the bot. 
	Bot *must* have "Manage Channels" permission.

	Useful if you'd like memebers of your 
	server to be able to edit channel names
	without giving them access to the other 
	permissions attached to managing channels.
*/

'use strict';

//searches an input for two arguments wrapped in double quotes ("")
function getArgs(input) {
	const quotePattern = /".*?"/g;
	const args = input.match(quotePattern);

	if (!args)  
		return { errorMessage: 'Please input the channel you wish to rename and your desired name change.' };
	else if (args.length < 2) 
		return { errorMessage: 'Please input your desired name change.' };
	else if (args[0] === args[1])
		return { errorMessage: 'Channel name already matches desired name.' };
	else {
		return { 
			query: args[0].replace(/"/g,''),
			name: args[1].replace(/"/g,'')
		};
	}
}

//checks to see if desired name change adheres to Discord's naming criteria
function checkName(name, type) {
	const validCharacterPattern = /^[a-zA-Z0-9_-]+$/;
	if (name.length < 2 || name.length > 100) 
		return { errorMessage: 'Channel names must be between 2-100 characters long.' }; 
	else if (type === 'text' && !validCharacterPattern.test(name))
		return { errorMessage: 'Text channel names must be alphanumeric with dashes or underscores.' }; 
	else 
		return { valid: true };
}

//searches server for a channel matching the provided query 
function findMatch(channels, query) {
	return channels.find('name', query);
}

module.exports = {
	name: 'rename',
	description: 'Change the name of a channel.',
	usage: 'rename [current] [desiredName]',
	process: function(bot, channel, input) {
		const args = getArgs(input);

		if (args.errorMessage)
			channel.sendMessage(args.errorMessage);

		else {
			const query = args.query;
			const name = args.name;
			const match = findMatch(bot.channels, query);
					
			if (!match) 	
				channel.sendMessage('Channel not found.')						

			else { 
				const status = checkName(name, match.type);
				
				if (!status.valid) 
					channel.sendMessage(status.errorMessage); 		

				else { 
					match.setName(name);
					channel.sendMessage(
						'Channel "' + query + '" successfully renamed to "' + name + '"!');	
				}
			}
		}	
	}
};
