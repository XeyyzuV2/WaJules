module.exports = {
    name: 'ping',
    description: 'Replies with pong',
    category: 'utility',
    ownerOnly: false,
    async execute(message, sock) {
        await sock.sendMessage(message.key.remoteJid, { text: 'pong' }, { quoted: message });
    }
};
