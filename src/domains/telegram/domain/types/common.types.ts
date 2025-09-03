/**
 * Common Types
 * Shared types and utilities used across domains
 */

import { TelegramUser } from './core.types.js';
import { Message } from './message.types.js';

/**
 * Geographic location
 */
export interface Location {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

/**
 * Callback query from inline keyboard
 */
export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

/**
 * Parameters for forward message operation
 */
export interface ForwardMessageParams {
  message_thread_id?: number;
  video_start_timestamp?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
}
