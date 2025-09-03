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

/**
 * Input poll option for creating polls
 */
export interface InputPollOption {
  text: string;
  text_parse_mode?: string;
  text_entities?: MessageEntity[];
}

/**
 * Reply parameters for message replies
 */
export interface ReplyParameters {
  message_id: number;
  chat_id?: number | string;
  allow_sending_without_reply?: boolean;
  quote?: string;
  quote_parse_mode?: string;
  quote_entities?: MessageEntity[];
  quote_position?: number;
}

/**
 * Parameters for sending a poll
 */
export interface SendPollParams {
  business_connection_id?: string;
  chat_id: number | string;
  message_thread_id?: number;
  question: string;
  question_parse_mode?: string;
  question_entities?: MessageEntity[];
  options: InputPollOption[];
  is_anonymous?: boolean;
  type?: 'quiz' | 'regular';
  allows_multiple_answers?: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_parse_mode?: string;
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
  is_closed?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: any; // InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}
