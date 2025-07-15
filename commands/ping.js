module.exports = {
    name: 'ping',
    description: 'Replies with pong',
    async execute(message, sock) {
        await sock.sendMessage(message.key.remoteJid, { text: 'pong' }, { quoted: message });
    }
};
