const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const logger = require('../utils/logger');

const commands = new Map();
const cooldowns = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`../commands/${file}`);
        commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
                commands.set(alias, command);
            }
        }
        logger.log(`Loaded command: ${command.name}`);
    } catch (error) {
        logger.error(`Failed to load command ${file}:`, error);
    }
}


async function messageHandler(message, conn) {
    try {
        const body = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const prefix = '!'; // You can make this configurable

        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);

        if (!command) return;

        if (command.cooldown) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Map());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;
            const senderId = message.key.remoteJid + '-' + message.key.participant;


            if (timestamps.has(senderId)) {
                const expirationTime = timestamps.get(senderId) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return conn.sendMessage(message.key.remoteJid, { text: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.` });
                }
            }

            timestamps.set(senderId, now);
            setTimeout(() => timestamps.delete(senderId), cooldownAmount);
        }


        await command.execute(message, conn, args);

    } catch (error) {
        logger.error('Error in message handler:', error);
        await conn.sendMessage(message.key.remoteJid, { text: 'An error occurred while executing the command.' });
    }
}

module.exports = messageHandler;
