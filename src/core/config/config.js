'use strict';
const path = require('path');
const Promise = require('bluebird');
const writeFile = Promise.promisify(require("fs").writeFile);

class Configuration {
	constructor(configPath) {
		this.pathAbs = path.resolve(__dirname, configPath);
		try { this.config = require(this.pathAbs); } 
		catch (err) {			
			if (err.code === 'MODULE_NOT_FOUND') 
				throw new Error('Configuration file "' + this.pathAbs + '" does not exist.');
			console.error('WARNING: Config file "' + this.pathAbs + '" found but could not be parsed.');
			throw err;					
		}	
	}

	get(prop) {
		if (this.config[prop]) 
			return this.config[prop];
		console.error(`WARNING: Config property "${prop}" not found.`);
	}

	set(prop, val) {			
		this.config[prop] = val;	
		return writeFile(this.pathAbs, JSON.stringify(this.config, null, 2))
			.then(() => { 
				console.log(`Property "${prop}" successfully saved as "${val}".`);
				return val;
			})
			.catch(err => {
				console.error(`WARNING: Failure saving property "${prop}" as "${val}".`, '\n', err);
			});
	}
}

module.exports = Configuration;
