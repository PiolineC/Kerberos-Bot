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

module.exports = {
	name: 'rename',
	description: 'Change the name of a channel.',
	help: 'rename "currentName" "desiredName"',
	process: function(bot, channel, input) {
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
}
