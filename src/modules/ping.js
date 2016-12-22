/*

This command allows users to debug
if the bot is working properly and
in a timely manner.

*/

'use strict';
const Promise = require('bluebird');

function ping() {
	const start = process.hrtime();
	return Promise.resolve('Pong!')
		.then(output => { 
			const time = process.hrtime(start); 
			return output + `\nTook ${time[0]*1e3 + time[1]/1e6} ms`;
		});
}

module.exports = {
	name: 'ping',
	description: 
		'Responds with "Pong!" and time taken to execute command.',
	usage: 'ping',
	process: ping
};
