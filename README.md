# Telegram MCP Server

An MCP server implementation that provides tools for interacting with the [Telegram Bot API](https://core.telegram.org/bots/api). This service allows AI assistants to send messages and retrieve bot information programmatically.

## Tools
The Telegram MCP Service provides the following tools for interacting with the Telegram Bot API:

### get_bot_info
Retrieves basic information about the bot.
- No parameters required
- Returns a User object containing bot information

### send_message
Sends a message to a specified chat.
- `chatId`: Unique identifier for the target chat (can be string or number)
- `text`: Text of the message to be sent
- `params` (optional): Additional parameters for the message (e.g., parse_mode, reply_markup, etc.)

### get_updates
Receives incoming updates using long polling.
- `params` (optional): Object containing optional parameters:
  - `offset` (optional): Identifier of the first update to be returned
  - `limit` (optional): Limits the number of updates to be retrieved (1-100)
  - `timeout` (optional): Timeout in seconds for long polling
  - `allowed_updates` (optional): Array of update types to receive
- Returns an array of Update objects containing various types of updates:
  - Messages and edited messages
  - Channel posts
  - Business messages
  - Inline queries
  - Callback queries
  - Shipping queries
  - Pre-checkout queries
  - Polls and poll answers
  - Chat member updates
  - Chat join requests
  - Chat boosts

### forward_message
Forwards messages of any kind. Service messages and messages with protected content can't be forwarded.
- `chatId`: Unique identifier for the target chat or username of the target channel (in the format @channelusername)
- `fromChatId`: Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
- `messageId`: Message identifier in the chat specified in from_chat_id
- `params` (optional): Object containing optional parameters:
  - `message_thread_id` (optional): Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
  - `video_start_timestamp` (optional): New start timestamp for the forwarded video in the message
  - `disable_notification` (optional): Sends the message silently. Users will receive a notification with no sound.
  - `protect_content` (optional): Protects the contents of the forwarded message from forwarding and saving
- Returns the sent Message object on success

## Configuration

### Environment Variables

You need to set up the following environment variable:

```
TELEGRAM_BOT_TOKEN=your_bot_token
```

You can get your bot token by talking to [@BotFather](https://t.me/BotFather) on Telegram and creating a new bot.

#### Creating a new bot
Use the `/newbot` command to create a new bot. `@BotFather` will ask you for a name and username, then generate an authentication token for your new bot.

The name of your bot is displayed in contact details and elsewhere.

The username is a short name, used in search, mentions and t.me links. Usernames are 5-32 characters long and not case sensitive – but may only include Latin characters, numbers, and underscores. Your bot's username must end in 'bot', like 'tetris_bot' or 'TetrisBot'.

The token is a string, like 110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw, which is required to authorize the bot and send requests to the Bot API. Keep your token secure and store it safely, it can be used by anyone to control your bot.

Unlike the bot's name, the username cannot be changed later – so choose it carefully.
When sending a request to api.telegram.org, remember to prefix the word 'bot' to your token.

## Development

```bash
npm install

npm run build

npx @modelcontextprotocol/inspector node dist/index.js
```

Open http://127.0.0.1:6274 to set up the environment and interact with the tools.

## License
This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
