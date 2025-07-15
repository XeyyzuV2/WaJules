module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Replies with pong',
    cooldown: 5,
    async execute(message, conn) {
        await conn.sendMessage(message.key.remoteJid, { text: 'pong' }, { quoted: message });
    }
};
