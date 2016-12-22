/* 

This command allows users to change voice
or text channel	names through the bot. 
Bot *must* have "Manage Channels" permission.

Useful if you'd like memebers of your 
server to be able to edit channel names
without giving them access to the other 
permissions attached to "Manage Channels".

*/

'use strict';
const Promise = require('bluebird');

const quotePattern = /"(.*?)"/g; 
const shortcutPattern = /(v|t)\d+/; 
const validCharacterPattern = /^[a-zA-Z0-9_-]+$/;

function rename(input, channels) {
	let name, oldName;
	return getArgs(input)
		.then(args => {
			name = args.name;
			return findMatch(args.query, channels);
		})
		.then(match => checkName(name, match))
		.then(match => { 
			oldName = match.name;
			return match.setName(name);				
		})	
		.then(channel => Promise.resolve(`Channel "${oldName}" successfully renamed to "${channel.name}"!`))
		.catch(err => Promise.reject(err));
}

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

	if (args.length === 0)  
		return Promise.reject('Please input the channel you wish to rename and your desired name change.');
	else if (args.length === 1) 
		return Promise.reject('Please input your desired name change.');
	else {
		const query = args[0].shortcut ? args[0] : args[0].replace(/"/g,'');
		const name = args[1].replace(/"/g,'');		
		return Promise.resolve({ query: query, name: name });
	}
}

//checks to see if desired name change adheres to Discord's naming criteria
function checkName(name, channel) {	
	if (name.length < 2 || name.length > 100) 
		return Promise.reject('Channel names must be between 2-100 characters long.');
	else if (name === channel.name) 
		return Promise.reject(`Channel name is already "${name}"!`);
	else if (channel.type === 'text' && !validCharacterPattern.test(name))
		return Promise.reject('Text channel names must be alphanumeric with dashes or underscores.'); 
	else 
		return Promise.resolve(channel);
}

//searches server for a channel matching the provided query 
function findMatch(query, channels) {
	let match;
	if (query.shortcut)
		match = channels.find(channel => channel.type === query.type && channel.position === query.index);
	else
		match = channels.find('name', query);
	return match ? Promise.resolve(match) : Promise.reject('Channel' + (query.shortcut ? '' : ` "${query}"`) + ' not found.');	
}

module.exports = {
	name: 'rename',
	usage: '"from" "to"',
	description: 'Change the name of a channel.',	
	process: rename
};
