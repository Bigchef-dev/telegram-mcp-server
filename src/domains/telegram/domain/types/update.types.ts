/**
 * Update Related Types
 * Telegram updates and polling parameters
 */

import { Message } from './message.types.js';
import { BusinessConnection, BusinessMessagesDeleted } from './business.types.js';
import { MessageReactionUpdated, MessageReactionCountUpdated } from './reaction.types.js';
import { InlineQuery, ChosenInlineResult } from './inline.types.js';
import { CallbackQuery } from './common.types.js';
import { ShippingQuery, PreCheckoutQuery, PaidMediaPurchased } from './payment.types.js';
import { Poll, PollAnswer } from './poll.types.js';
import { ChatMemberUpdated, ChatJoinRequest } from './chat.types.js';
import { ChatBoostUpdated, ChatBoostRemoved } from './boost.types.js';

/**
 * Telegram update containing various event types
 */
export interface TelegramUpdate {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  business_connection?: BusinessConnection;
  business_message?: Message;
  edited_business_message?: Message;
  deleted_business_messages?: BusinessMessagesDeleted;
  message_reaction?: MessageReactionUpdated;
  message_reaction_count?: MessageReactionCountUpdated;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: ShippingQuery;
  pre_checkout_query?: PreCheckoutQuery;
  purchased_paid_media?: PaidMediaPurchased;
  poll?: Poll;
  poll_answer?: PollAnswer;
  my_chat_member?: ChatMemberUpdated;
  chat_member?: ChatMemberUpdated;
  chat_join_request?: ChatJoinRequest;
  chat_boost?: ChatBoostUpdated;
  removed_chat_boost?: ChatBoostRemoved;
}

/**
 * Parameters for getUpdates API call
 */
export interface GetUpdatesParams {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowed_updates?: string[];
}
