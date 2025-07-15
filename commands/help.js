const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    aliases: ['h', 'menu'],
    description: 'Shows a list of available commands.',
    async execute(message, conn) {
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

        let helpText = 'Available Commands:\n\n';

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (command.name && command.description) {
                helpText += `*!${command.name}*\n`;
                helpText += `  Description: ${command.description}\n`;
                if(command.aliases) helpText += `  Aliases: ${command.aliases.join(', ')}\n`;
                if(command.cooldown) helpText += `  Cooldown: ${command.cooldown}s\n`;
                helpText += '\n';
            }
        }

        await conn.sendMessage(message.key.remoteJid, { text: helpText.trim() }, { quoted: message });
    }
};
