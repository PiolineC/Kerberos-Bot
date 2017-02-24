/*

This command fetches xkcd comics and
posts them in the chat.

*/

'use strict'
const Command = require('../command.js');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const domain = 'https://xkcd.com/';
const path = 'info.0.json';

class XKCD extends Command {
    constructor() {
        super();
        this.name = 'xkcd';
        this.description = 'Fetches an xkcd comic.';
        this.usage = '[#]';
        this.help = 'Fetches a specified xkcd comic. If no number is provided, a random comic is selected. If the number is zero, the most recent comic is selected.';
    }   

    execute(msg, input) {
        return this.parseArgs(input)
            .then(url => request(url))
            .then(response => this.fetchComic(response))
            .then(content => {
                msg.channel.sendMessage(`Comic #${content.num}: ${content.title}`)
                    .then(() => msg.channel.sendFile(content.img))                
                    .then(() => msg.channel.sendMessage(`${content.alt}`))
            });
    }

    trigger(cmd) {
        return cmd === 'xkcd';
    }

    parseArgs(input) {
        if (!input) {
            return request(domain + path)
                .then(response => { 
                    const max = JSON.parse(response.body).num;
                    const id = Math.floor(Math.random() * max + 1);
                    return domain + `${id}/` + path;
                });     
        }

        const num = parseInt(input);
        if (typeof num === 'number' && !Number.isNaN(num)) {
            if (num === 0)
                return Promise.resolve(domain + path); 
            return Promise.resolve(domain + `${num}/` + path);  
        }
        return Promise.reject('Invalid input.');             
    }
    
    fetchComic(response) {
        if (response.statusCode === 404)
            return Promise.reject('Comic does not exist.');
        if (response.statusCode !== 200)
            return Promise.reject('Error retrieving comic.');
        return JSON.parse(response.body);
    }
}

module.exports = XKCD;
