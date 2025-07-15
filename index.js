/**
 * WaJules - WhatsApp Bot
 *
 * Copyright (c) 2024 Xeyyzu and Jules
 *
 * This code is licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 */
const pino = require('pino');
const fs = require('fs');
const connectToWhatsApp = require('./lib/connect');

const logFilePath = 'bot.log';

// Hapus file log lama jika ada
if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
}

const logger = pino({
    level: 'info',
}, pino.destination(logFilePath));

// Redirect console.log/error/warn/info ke pino logger
console.log = (msg) => logger.info(msg);
console.error = (msg) => logger.error(msg);
console.warn = (msg) => logger.warn(msg);
console.info = (msg) => logger.info(msg);


function getAuthMethod() {
    const authMethodArg = process.argv.find(arg => arg.startsWith('AUTH_METHOD='));
    if (authMethodArg) {
        return authMethodArg.split('=')[1].toLowerCase();
    }
    return process.env.AUTH_METHOD ? process.env.AUTH_METHOD.toLowerCase() : 'qr'; // Default to QR
}

async function startBot() {
    const authMethod = getAuthMethod();
    const validMethods = ['qr', 'pairing', 'otp'];

    if (!validMethods.includes(authMethod)) {
        console.error(`Invalid authentication method: ${authMethod}. Please use one of ${validMethods.join(', ')}.`);
        process.exit(1);
    }

    console.info(`Starting bot with authentication method: ${authMethod.toUpperCase()}`);

    try {
        await connectToWhatsApp(authMethod);
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
