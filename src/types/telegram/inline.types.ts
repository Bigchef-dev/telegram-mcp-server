/**
 * Inline Related Types
 * Inline queries and chosen results
 */

import { TelegramUser } from './core.types.js';
import { Location } from './common.types.js';

/**
 * Inline query from user
 */
export interface InlineQuery {
  id: string;
  from: TelegramUser;
  query: string;
  offset: string;
  chat_type?: string;
  location?: Location;
}

/**
 * Result chosen from inline query
 */
export interface ChosenInlineResult {
  result_id: string;
  from: TelegramUser;
  location?: Location;
  inline_message_id?: string;
  query: string;
}
