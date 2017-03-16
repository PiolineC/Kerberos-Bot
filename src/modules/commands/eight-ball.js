/*

This command lets users put their fates into
the hands of the almighty eight-ball.

*/

'use strict';
const Command = require('../command.js');
const Promise = require('bluebird');

let eightball = 
	[
		"It is certain.",
		"It is decidedly so.",
		"Without a doubt.", 
		"Yes, definitely.",
		"You may rely on it.",
		"As I see it, yes.",
		"Most likely.",
		"Outlook good.",
		"Yes.",
		"Signs point to yes.",
		"Reply hazy try again.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again.",
		"Don't count on it.",
		"My reply is no.",
		"My sources say no.",
		"Outlook not so good.",
		"Very doubtful."
	];

class EightBall extends Command {
	constructor() {
		super();
		this.name = '8ball';
		this.description = `Seeks the advice of the magic 8-ball.`;
		this.usage = '[question]';
	}

	execute() {
		let index = Math.floor(Math.random()*eightball.length);
		return Promise.resolve(eightball[index]);
	}

	trigger(cmd) {
		return cmd === '8ball' || cmd === 'eightball' || cmd === '🎱';
	}
}

module.exports = EightBall;
