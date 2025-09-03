/**
 * Reaction Related Types
 * Message reactions and reaction counts
 */

import { Chat } from './chat.types.js';
import { TelegramUser } from './core.types.js';

/**
 * Reaction type (emoji or custom emoji)
 */
export interface ReactionType {
  type: string;
  emoji?: string;
  custom_emoji_id?: string;
}

/**
 * Reaction count for a specific reaction type
 */
export interface ReactionCount {
  type: ReactionType;
  total_count: number;
}

/**
 * Message reaction updated event
 */
export interface MessageReactionUpdated {
  chat: Chat;
  message_id: number;
  user: TelegramUser;
  actor_chat?: Chat;
  date: number;
  old_reaction: ReactionType[];
  new_reaction: ReactionType[];
}

/**
 * Message reaction count updated event
 */
export interface MessageReactionCountUpdated {
  chat: Chat;
  message_id: number;
  date: number;
  reactions: ReactionCount[];
}
