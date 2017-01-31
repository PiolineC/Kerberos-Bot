'use strict'
const glob = require('glob');
const Command = require('../../modules/command.js');

class CommandFinder {
    constructor() {
        throw new Error('Do not instantiate CommandFinder.');
    }

    static getCommands(options) {
        return glob.sync('../../modules/commands/*.js', { cwd: __dirname })
            .map(path => require(path))
            .filter(mod => mod.prototype instanceof Command)
            .map(cmd => new cmd(options));
    }
}

module.exports = CommandFinder;
