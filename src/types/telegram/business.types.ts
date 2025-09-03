/**
 * Business Related Types
 * Business connections and business messaging features
 */

import { TelegramUser } from './core.types.js';
import { Chat } from './chat.types.js';

/**
 * Business connection representation
 */
export interface BusinessConnection {
  id: string;
  user: TelegramUser;
  user_chat_id: number;
  date: number;
  can_reply: boolean;
  is_enabled: boolean;
}

/**
 * Business messages deleted event
 */
export interface BusinessMessagesDeleted {
  business_connection_id: string;
  chat: Chat;
  message_ids: number[];
}
