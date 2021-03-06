'use strict'
const Promise = require('bluebird');

class Command {
    constructor(options) {
        this.name = '';
        this.description = '';
        this.usage = '';
        this.help = '';
        this.options = options;
    }   

    execute(msg, input) {
        return Promise.reject();
    }

    trigger(cmd) {
        return false;
    }
}

module.exports = Command;
