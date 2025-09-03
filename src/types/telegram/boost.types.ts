/**
 * Boost Related Types
 * Chat boost features and events
 */

import { Chat } from './chat.types.js';
import { TelegramUser } from './core.types.js';
import { Message } from './message.types.js';

/**
 * Chat boost source information
 */
export interface ChatBoostSource {
  source: string;
  user?: TelegramUser;
  giveaway_message?: Message;
  giveaway_winner_count?: number;
  unclaimed_prize_count?: number;
  giveaway_message_id?: number;
}

/**
 * Chat boost representation
 */
export interface ChatBoost {
  boost_id: string;
  add_date: number;
  expiration_date: number;
  source: ChatBoostSource;
}

/**
 * Chat boost updated event
 */
export interface ChatBoostUpdated {
  chat: Chat;
  boost: ChatBoost;
}

/**
 * Chat boost removed event
 */
export interface ChatBoostRemoved {
  chat: Chat;
  boost: ChatBoost;
}
