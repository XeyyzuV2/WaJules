const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const logger = require('../utils/logger');
const config = require('../config.json');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    description: 'Create a sticker from an image',
    cooldown: 10,
    async execute(message, conn) {
        try {
            const isImage = message.message?.imageMessage;
            const isQuotedImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

            if (isImage || isQuotedImage) {
                const msgToDownload = isImage ? message.message.imageMessage : isQuotedImage;
                const stream = await downloadContentFromMessage(msgToDownload, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                const sticker = new Sticker(buffer, {
                    pack: config.packname,
                    author: config.author,
                    type: StickerTypes.FULL,
                    quality: 50
                });

                await conn.sendMessage(message.key.remoteJid, await sticker.toMessage());
            } else {
                await conn.sendMessage(message.key.remoteJid, { text: 'Reply to an image or send an image with the command to create a sticker.' });
            }
        } catch (error) {
            logger.error('Error creating sticker:', error);
            await conn.sendMessage(message.key.remoteJid, { text: 'Failed to create sticker.' });
        }
    }
};
