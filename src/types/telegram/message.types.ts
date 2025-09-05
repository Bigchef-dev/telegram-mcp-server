/**
 * Message Related Types
 * Message entities, content, and formatting
 */

import { TelegramUser } from './core.types.js';
import { Chat } from './chat.types.js';
import { Poll } from './poll.types.js';

/**
 * Telegram message representation
 */
export interface Message {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: Chat;
  text?: string;
  poll?: Poll;
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

/**
 * Parameters for pinning a chat message
 */
export interface PinChatMessageParams {
  business_connection_id?: string;
  chat_id: number | string;
  message_id: number;
  disable_notification?: boolean;
}

/**
 * Parameters for unpinning a chat message
 */
export interface UnpinChatMessageParams {
  business_connection_id?: string;
  chat_id: number | string;
  message_id?: number;
}

/**
 * Parameters for unpinning all chat messages
 */
export interface UnpinAllChatMessagesParams {
  chat_id: number | string;
}

/**
 * Parameters for sending a contact
 */
export interface SendContactParams {
  business_connection_id?: string;
  chat_id: number | string;
  message_thread_id?: number;
  direct_messages_topic_id?: number;
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: Record<string, any>;
  reply_markup?: Record<string, any>;
}
