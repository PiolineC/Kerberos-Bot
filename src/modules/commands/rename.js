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
const Command = require('../command.js');

const quotePattern = /"(.*?)"/g; 
const shortcutPattern = /(v|t)\d+/; 
const validCharacterPattern = /^[a-zA-Z0-9_-]+$/;

class Rename extends Command {
	constructor() {
		super();
		this.name = 'rn';
		this.description = "Changes the name of a channel.";
		this.usage = '["channel name"] ["name change"]';
		this.help = `Change the name of a channel. The first argument can either be the current name of the channel or the special syntax [channel type][index]. Channel type is a single letter (v or t) indicating the type of channel you wish to rename. For example, $rn v1 "example" will have the same effect as $rn "voice channel 1 name" "example".`;		
	}

	execute(msg, args) {
		let name, oldName;
		return this.parseArgs(args)
			.then(args => {
				name = args.name;
				return this.findMatch(args.query, msg.guild.channels);
			})
			.then(match => this.checkName(name, match))
			.then(match => { 
				oldName = match.name;
				return match.setName(name);				
			})	
			.then(channel => Promise.resolve(`Channel "${oldName}" successfully renamed to "${channel.name}"!`))
			.catch(err => Promise.reject(err));
	}

	trigger(cmd) {
		return cmd === 'rn' || cmd === 'rename';
	}

	//searches an input for two arguments
	parseArgs(input) {	
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
	checkName(name, channel) {	
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
	findMatch(query, channels) {
		let match;
		if (query.shortcut)
			match = channels.find(channel => channel.type === query.type && channel.position === query.index);
		else
			match = channels.find('name', query);
		return match ? Promise.resolve(match) : Promise.reject('Channel' + (query.shortcut ? '' : ` "${query}"`) + ' not found.');	
	}
}

module.exports = Rename;
