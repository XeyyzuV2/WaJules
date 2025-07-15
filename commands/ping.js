/**
 * WaJules - WhatsApp Bot
 *
 * Copyright (c) 2024 Xeyyzu and Jules
 *
 * This code is licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 */
module.exports = {
    name: 'ping',
    description: 'Replies with pong',
    category: 'utility',
    ownerOnly: false,
    async execute(message, sock) {
        await sock.sendMessage(message.key.remoteJid, { text: 'pong' }, { quoted: message });
    }
};
