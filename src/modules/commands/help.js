'use strict';
const Promise = require('bluebird');

class Help {
    constructor(prefix, commands) {
        this.commandMap = new Map();
        this.prefix = prefix;
        this.descriptionText = `Type ${this.prefix}help [command] to see advanced help text.\n\n`;                

        for (let cmd of commands) {
            this.commandMap.set(cmd.name, { cmd: cmd, desc: cmd.description, help: cmd.help });
            this.descriptionText += this.generateDescription(cmd);
        }
    }

    generateDescription(cmd) {
        return `\`${this.prefix}${cmd.name}\` ${cmd.usage ? `\`${cmd.usage}\`` : ''}\n\t${cmd.description}\n`;
    }

    generateHelpText(cmdName) {
        const info = this.commandMap.get(cmdName);
        if (!info)
            return '';
        const cmd = info.cmd;
        return info.help ? `\`${this.prefix}${cmd.name}\` ${cmd.usage ? `\`${cmd.usage}\`` : ''}\n\t${Help.splitText(info.help.replace(/\$/g, this.prefix), 50, '\n\t')}` : this.generateDescription(info.cmd);
    }

    static splitText(str, len, splitter) {
        let result = '';
        let letterCount = 0;
        let words = str.split(' ');
        for (let word of words) {
            if (letterCount >= len) {
                result += splitter;
                letterCount = 0;
            }
            result += word + ' ';
            letterCount += word.length + 1;
        }
        return result;
    }
}

module.exports = Help;
