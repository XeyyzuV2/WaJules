const fs = require('fs');
const path = require('path');

const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`../commands/${file}`);
        commands.set(command.name, command);
    } catch (error) {
        console.error(`Failed to load command ${file}:`, error);
    }
}

const config = require('../config.json');

async function messageHandler(message, sock) {
    try {
        const body = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const prefix = '!';

        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = commands.get(commandName);

        if (!command) return;

        // Owner Only Check
        if (command.ownerOnly) {
            const senderNumber = message.key.remoteJid.split('@')[0];
            if (!config.owner.includes(senderNumber)) {
                return sock.sendMessage(message.key.remoteJid, { text: 'This command can only be used by the owner.' }, { quoted: message });
            }
        }

        // Usage Check
        if (command.usage && args.length < 1) {
             let reply = `*Usage:* ${prefix}${command.name} ${command.usage}\n`;
             if(command.example) reply += `*Example:* ${prefix}${command.name} ${command.example}`
             return sock.sendMessage(message.key.remoteJid, { text: reply }, { quoted: message });
        }


        await command.execute(message, sock, args);

    } catch (error) {
        console.error('Error in message handler:', error);
        sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while executing the command.' }, { quoted: message });
    }
}

module.exports = messageHandler;
