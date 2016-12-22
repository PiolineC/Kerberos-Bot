'use strict';
const fs = require('fs');

module.exports = {
	init: function() {		
		let config = {};
		try { config = require('../../../config.json'); } 

		catch (err) {					
			try {
				//logs if there was an error parsing file
				if (fs.statSync("./config.json").isFile()) {
					console.log('WARNING: File "config.json" found but could not be parsed.');
					throw err;
				}

			} catch (err) { 
				//generate a new config file if one does not exist
				// if (err.code === 'ENOENT') { 
				// 	console.log('Initializing "config.json"...');
				// 	config.token = '';
				// 	config.command_prefix = '>';
				// 	fs.writeFile("./config.json", JSON.stringify(config, null, 2));
				console.log('WARNING: File "config.json" not found.');

				//otherwise rethrow the error
				} else { throw err; }
			}
		}

		//initialize defaults where applicable
		if(!config.hasOwnProperty('token'))
			config.token = '';

		if(!config.hasOwnProperty('command_prefix'))
			config.command_prefix = '>';

		return config;
	}
}
