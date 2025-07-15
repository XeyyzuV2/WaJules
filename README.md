# WaJules Bot

A WhatsApp bot built with Baileys.

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Termux Installation

If you are using Termux, you may need to install `ffmpeg` manually:
```bash
pkg install ffmpeg
```

## Configuration

Edit `config.json` to set your owner number, packname, and author name.

```json
{
  "owner": ["628xxxxxxxxxx"],
  "packname": "WaJules",
  "author": "XeyyzuDev"
}
```

## Running the Bot

To start the bot, run:
```bash
npm start
```

You will need to scan the QR code with your WhatsApp account to log in.

## Available Commands

- `!ping` - Replies with "pong".
- `!sticker` - Create a sticker from an image. Reply to an image or send an image with the command.
- `!help` - Shows a list of available commands.
