'use strict';
const fs = require('fs');

let config = {};
const configPath = '../config.json';

module.exports = {
	init: function() {	
		try { config = require(configPath); } 
		catch (err) {					
			try {
				//logs if there was an error parsing file
				if (fs.statSync(configPath).isFile()) {
					console.log('WARNING: File "config.json" found but could not be parsed.');
					throw err;
				}
			} catch (err) { 
				//generate a new config file if one does not exist
				if (err.code === 'ENOENT') { 
					console.log('Initializing "config.json"...');
					config.token = '';
					config.command_prefix = '>';
					fs.writeFile(configPath, JSON.stringify(config, null, 2));

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
