const connectToWhatsApp = require('./lib/connect');
const logger = require('./utils/logger');

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
        logger.error(`Invalid authentication method: ${authMethod}. Please use one of ${validMethods.join(', ')}.`);
        process.exit(1);
    }

    logger.info(`Starting bot with authentication method: ${authMethod.toUpperCase()}`);

    try {
        await connectToWhatsApp(authMethod);
    } catch (error) {
        logger.error('Failed to start bot:', error);
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
