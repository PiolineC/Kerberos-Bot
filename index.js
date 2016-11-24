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
	sender = msg.author;

	/* 
		Exit and stop if message doesn't start with prefix
		or if the message sender is another bot.
	*/
	if(!input.startsWith(prefix)) return;
	if(sender.bot) return;

	if (input.startsWith(prefix + 'rename')) {
		try {		
			console.log(input.substring(prefix.length + 7));
			let args = input.substring(prefix.length + 7).split('"');
			console.log(args);
			let query = args[1];
			console.log(query);
			let name = args[3];
			console.log(name);

			let match = bot.channels.find('name', query);
			match.setName(name);

		} catch (err) {	
			msg.channel.sendMessage('Channel not found.'); 
		}
	} 
});

bot.login(token);