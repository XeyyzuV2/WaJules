const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`../commands/${file}`);
        commands.set(command.name, command);
    } catch (error) {
        logger.error(`Failed to load command ${file}:`, error);
    }
}

async function messageHandler(message, sock) {
    try {
        const body = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const prefix = '!';

        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);

        if (!command) return;

        await command.execute(message, sock, args);

    } catch (error) {
        logger.error('Error in message handler:', error);
    }
}

module.exports = messageHandler;
