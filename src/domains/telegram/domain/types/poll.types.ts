/**
 * Poll Related Types
 * Polls, poll options, and poll answers
 */

import { TelegramUser } from './core.types.js';
import { MessageEntity } from './message.types.js';

/**
 * Poll option
 */
export interface PollOption {
  text: string;
  voter_count: number;
}

/**
 * Poll representation
 */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_voter_count: number;
  is_closed: boolean;
  is_anonymous: boolean;
  type: string;
  allows_multiple_answers: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
}

/**
 * Poll answer from user
 */
export interface PollAnswer {
  poll_id: string;
  user: TelegramUser;
  option_ids: number[];
}
