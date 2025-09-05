# Telegram MCP Server

[![smithery badge](https://smithery.ai/badge/@NexusX-MCP/telegram-mcp-server)](https://smithery.ai/server/@NexusX-MCP/telegram-mcp-server)

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

### pin_chat_message
Adds a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively.
- `chatId`: Unique identifier for the target chat or username of the target channel (in the format @channelusername)
- `messageId`: Identifier of a message to pin
- `businessConnectionId` (optional): Unique identifier of the business connection on behalf of which the message will be pinned
- `disableNotification` (optional): Pass True if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.
- Returns True on success

### unpin_chat_message
Removes a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively.
- `chatId`: Unique identifier for the target chat or username of the target channel (in the format @channelusername)
- `messageId` (optional): Identifier of the message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned
- `businessConnectionId` (optional): Unique identifier of the business connection on behalf of which the message will be unpinned
- Returns True on success

### unpin_all_chat_messages
Clears the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively.
- `chatId`: Unique identifier for the target chat or username of the target channel (in the format @channelusername)
- Returns True on success

### getChat
Gets up-to-date information about the chat. Returns detailed chat information including settings, permissions, and metadata.
- `chat_id`: Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
- Returns a ChatFullInfo object containing comprehensive chat details:
  - Basic info: id, type, title, username, description
  - Settings: permissions, slow mode delay, message auto-delete time
  - Features: protected content, hidden members, aggressive anti-spam
  - Optional info: photo, location, sticker set, linked chat
  - Business info: intro, location, opening hours (for business accounts)
  - Personal info: birthdate, bio, emoji status (for private chats)

### sendPoll
Sends a native poll to a chat. Returns the sent Message containing the poll on success. Note that polls can't be sent to channel direct messages chats.
- `chat_id`: Unique identifier for the target chat or username of the target channel (in the format @channelusername)
- `question`: Poll question, 1-300 characters
- `options`: Array of **exactly 2 to 10 answer options** (required). Each option must have text of 1-100 characters with optional formatting
- `type` (optional): Poll type, "quiz" or "regular" (defaults to "regular")
- `is_anonymous` (optional): True if the poll should be anonymous (defaults to True)
- `allows_multiple_answers` (optional): True if multiple answers are allowed (defaults to False, ignored for quiz polls)
- `correct_option_id` (optional): 0-based identifier of the correct answer (required for quiz polls)
- `explanation` (optional): Text shown for incorrect quiz answers, 0-200 characters
- `open_period` (optional): Poll duration in seconds, 5-600 (can't be used with close_date)
- `close_date` (optional): Unix timestamp when poll closes (can't be used with open_period)
- `is_closed` (optional): True to immediately close the poll (useful for previews)
- `disable_notification` (optional): Send silently
- `protect_content` (optional): Protect message from forwarding/saving
- `reply_parameters` (optional): Reply to another message
- `reply_markup` (optional): Additional interface options (keyboards, etc.)
- Additional options: business_connection_id, message_thread_id, question_parse_mode, question_entities, explanation_parse_mode, explanation_entities, allow_paid_broadcast, message_effect_id

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

The token is a string, like 123456:my-secret, which is required to authorize the bot and send requests to the Bot API. Keep your token secure and store it safely, it can be used by anyone to control your bot.

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
