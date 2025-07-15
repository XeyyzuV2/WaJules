const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const readline = require('readline');
const messageHandler = require('../handler/message');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function connectToWhatsApp(authMethod) {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // QR akan kita handle sendiri
        auth: state,
        browser: Browsers.macOS('Desktop'),
    });

    // Pairing Code Auth
    if (!sock.authState.creds.registered && authMethod === 'pairing') {
        logger.info('Using Pairing Code Authentication');
        const phoneNumber = await question('Please enter your full WhatsApp number (e.g., 6281234567890): ');
        const pairingCode = await sock.requestPairingCode(phoneNumber);
        logger.log(`Your Pairing Code: ${pairingCode}`);
    }

    try {
        // Pairing Code Auth
        if (!sock.authState.creds.registered && authMethod === 'pairing') {
            console.info('Using Pairing Code Authentication');
            const phoneNumber = await question('Please enter your full WhatsApp number (e.g., 6281234567890): ');
            const pairingCode = await sock.requestPairingCode(phoneNumber);
            console.log(`Your Pairing Code: ${pairingCode}`);
        }

        // OTP Auth
        if (!sock.authState.creds.registered && authMethod === 'otp') {
            console.info('Using OTP Authentication');
            const phoneNumber = await question('Please enter your full WhatsApp number (e.g., 6281234567890): ');
            await sock.requestOTP(phoneNumber);
            const otpCode = await question('Please enter the OTP code you received: ');
            await sock.enterOTP(otpCode);
        }
    } catch (error) {
        console.error("Authentication failed:", error);
        console.error("Please delete the 'auth' folder and try again.");
        process.exit(1);
    }


    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'open') {
            console.log('✅ BOT CONNECTED!');
            rl.close();
        } else if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            console.error('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(authMethod);
            } else {
                console.error('Connection closed permanently. Please delete the "auth" folder and try again.');
            }
        }

        // QR Code Auth (Default)
        if (qr && authMethod === 'qr') {
            console.info('Using QR Code Authentication');
            qrcode.generate(qr, { small: true });
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        await messageHandler(msg, sock);
    });

    return sock;
}

module.exports = connectToWhatsApp;
