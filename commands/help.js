/**
 * WaJules - WhatsApp Bot
 *
 * Copyright (c) 2024 Xeyyzu and Jules
 *
 * This code is licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 */
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Shows a list of available commands.',
    category: 'utility',
    async execute(message, sock) {
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

        const categories = {};

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (!command.name || !command.category) continue;

            if (!categories[command.category]) {
                categories[command.category] = [];
            }
            categories[command.category].push(command);
        }

        let helpText = '📚 *Available Commands* 📚\n\n';

        for (const category in categories) {
            helpText += `*${category.charAt(0).toUpperCase() + category.slice(1)}*\n`;
            for (const command of categories[category]) {
                helpText += `  - !${command.name}\n`;
            }
            helpText += '\n';
        }

        helpText += 'Type `!help <commandName>` for more info on a specific command.';

        await sock.sendMessage(message.key.remoteJid, { text: helpText.trim() }, { quoted: message });
    }
};
