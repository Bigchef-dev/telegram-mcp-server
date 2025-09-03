/**
 * Core Telegram API Types
 * Base types and response wrappers
 */

/**
 * Generic response wrapper from Telegram Bot API
 */
export interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: {
    migrate_to_chat_id?: number;
    retry_after?: number;
  };
}

/**
 * Telegram user representation
 */
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;
}
