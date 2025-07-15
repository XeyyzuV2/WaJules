const connectToWhatsApp = require('./lib/connect');
const logger = require('./utils/logger');
require('./config.json');

async function startBot() {
    try {
        logger.log('Starting bot...');
        const conn = await connectToWhatsApp();
        logger.log('Bot started successfully');
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
