'use strict'
const Command = require('../../modules/command.js');
const glob = require('glob');

class CommandFinder {
    constructor() {
        throw new Error('Do not instantiate CommandFinder.');
    }

    static getCommands(options) {
        return new Map(glob.sync('../../modules/commands/*.js', { cwd: __dirname })
            .map(path => require(path))
            .filter(mod => mod.prototype instanceof Command)
            .map(cmd => {
                const instance = new cmd(options);
                return [instance.name, instance];
            })
        );
    }
}

module.exports = CommandFinder;
