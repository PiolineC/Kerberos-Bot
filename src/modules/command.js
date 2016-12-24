const Promise = require('bluebird');

class Command {
    constructor() {
        this.name = 'command';
        this.description = 'command description';
        this.usage = 'command';
        this.args = '[arg1] ([arg2]...)';
    }   

    process(msgObj, args) {
        return Promise.reject();
    }

    validate(cmd) {
        return true;
    }
}

module.exports = Command;
