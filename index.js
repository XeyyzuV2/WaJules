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


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));


async function startBot() {
    console.log('Please choose your authentication method:');
    console.log('1: QR Code');
    console.log('2: Pairing Code');
    console.log('3: OTP');

    const choice = await question('Enter your choice (1-3): ');

    let authMethod;
    switch (choice) {
        case '1':
            authMethod = 'qr';
            break;
        case '2':
            authMethod = 'pairing';
            break;
        case '3':
            authMethod = 'otp';
            break;
        default:
            console.error('Invalid choice. Exiting.');
            process.exit(1);
    }

    console.info(`Starting bot with authentication method: ${authMethod.toUpperCase()}`);
    rl.close();

    try {
        await connectToWhatsApp(authMethod);
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});
