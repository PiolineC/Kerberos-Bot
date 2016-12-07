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

const quotePattern = /"(.*?)"/g; 
const shortcutPattern = /(v|t)\d+/; 
const validCharacterPattern = /^[a-zA-Z0-9_-]+$/;

//searches an input for two arguments
function getArgs(input) {	
	let args = input.match(quotePattern) || [];
	const shortcut = input.replace(quotePattern, '').match(shortcutPattern);

	if (shortcut && args.length < 2) {
		args.unshift({ 
			type: shortcut[0].charAt(0) === 't' ? 'text' : 'voice',
			index: parseInt(shortcut[0].slice(1))-1,
			shortcut: true
		});		
	}

	if (!args)  
		return { errorMessage: 'Please input the channel you wish to rename and your desired name change.' };
	else if (args.length < 2) 
		return { errorMessage: 'Please input your desired name change.' };
	else {
		const query = args[0].shortcut ? args[0] : args[0].replace(/"/g,'');
		const name = args[1].replace(/"/g,'');		
		return { query: query, name: name };
	}
}

//checks to see if desired name change adheres to Discord's naming criteria
function checkName(name, type) {	
	if (name.length < 2 || name.length > 100) 
		return { errorMessage: 'Channel names must be between 2-100 characters long.' }; 
	else if (type === 'text' && !validCharacterPattern.test(name))
		return { errorMessage: 'Text channel names must be alphanumeric with dashes or underscores.' }; 
	else 
		return { valid: true };
}

//searches server for a channel matching the provided query 
function findMatch(channels, query) {
	if (!query.shortcut)
		return channels.find('name', query);
	else {
		return channels.find(function(channel) {
			return channel.type === query.type && channel.position === query.index;
		});
	}
}

module.exports = {
	name: 'rename',
	description: 'Change the name of a channel.',
	usage: 'rename "from" "to"',
	process: function(bot, channel, input) {
		const args = getArgs(input);		
		if (args.errorMessage)
			channel.sendMessage(args.errorMessage);
		else {
			const name = args.name;
			const query = args.query;
			const match = findMatch(bot.channels, query);	
					
			if (!match) 	
				channel.sendMessage('Channel' + (query.shortcut ? '' : ' "' + query + '" ' ) + ' not found.');			
			else { 
				const status = checkName(name, match.type);
				if (!status.valid) 
					channel.sendMessage(status.errorMessage); 
				else { 
					const oldName = match.name;
					if (oldName === name)
						channel.sendMessage('Channel name is already "' + oldName + '"!');
					else {
						match.setName(name)	
						.then(function onSuccess() { 
							channel.sendMessage('Channel "' + oldName + '" successfully renamed to "' + name + '"!'); 
						})
						.catch(function onError() { channel.sendMessage('Naming operation failed.'); });							
					}				
				}
			}
		}	
	}
};
