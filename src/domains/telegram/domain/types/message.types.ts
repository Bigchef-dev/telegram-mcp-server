/**
 * Message Related Types
 * Message entities, content, and formatting
 */

import { TelegramUser } from './core.types.js';
import { Chat } from './chat.types.js';

/**
 * Telegram message representation
 */
export interface Message {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: Chat;
  text?: string;
  // Add other message fields as needed
}

/**
 * Message entity for text formatting
 */
export interface MessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
  custom_emoji_id?: string;
}
