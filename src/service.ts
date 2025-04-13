import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: {
    migrate_to_chat_id?: number;
    retry_after?: number;
  };
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;
}

interface TelegramUpdate {
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

interface Message {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: Chat;
  text?: string;
  // Add other message fields as needed
}

interface Chat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface GetUpdatesParams {
  offset?: number;
  limit?: number;
  timeout?: number;
  allowed_updates?: string[];
}

interface BusinessConnection {
  id: string;
  user: TelegramUser;
  user_chat_id: number;
  date: number;
  can_reply: boolean;
  is_enabled: boolean;
}

interface BusinessMessagesDeleted {
  business_connection_id: string;
  chat: Chat;
  message_ids: number[];
}

interface MessageReactionUpdated {
  chat: Chat;
  message_id: number;
  user: TelegramUser;
  actor_chat?: Chat;
  date: number;
  old_reaction: ReactionType[];
  new_reaction: ReactionType[];
}

interface MessageReactionCountUpdated {
  chat: Chat;
  message_id: number;
  date: number;
  reactions: ReactionCount[];
}

interface InlineQuery {
  id: string;
  from: TelegramUser;
  query: string;
  offset: string;
  chat_type?: string;
  location?: Location;
}

interface ChosenInlineResult {
  result_id: string;
  from: TelegramUser;
  location?: Location;
  inline_message_id?: string;
  query: string;
}

interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

interface ShippingQuery {
  id: string;
  from: TelegramUser;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}

interface PreCheckoutQuery {
  id: string;
  from: TelegramUser;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
}

interface PaidMediaPurchased {
  user: TelegramUser;
  chat: Chat;
  message_id: number;
  invoice_payload: string;
}

interface Location {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

interface ReactionType {
  type: string;
  emoji?: string;
  custom_emoji_id?: string;
}

interface ReactionCount {
  type: ReactionType;
  total_count: number;
}

interface Poll {
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

interface PollOption {
  text: string;
  voter_count: number;
}

interface MessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
  custom_emoji_id?: string;
}

interface PollAnswer {
  poll_id: string;
  user: TelegramUser;
  option_ids: number[];
}

interface ChatMemberUpdated {
  chat: Chat;
  from: TelegramUser;
  date: number;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
  via_chat_folder_invite_link?: boolean;
}

interface ChatMember {
  user: TelegramUser;
  status: string;
  custom_title?: string;
  is_anonymous?: boolean;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  is_member?: boolean;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  until_date?: number;
}

interface ChatInviteLink {
  invite_link: string;
  creator: TelegramUser;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
}

interface ChatJoinRequest {
  chat: Chat;
  from: TelegramUser;
  user_chat_id: number;
  date: number;
  bio?: string;
  invite_link?: ChatInviteLink;
}

interface ChatBoostUpdated {
  chat: Chat;
  boost: ChatBoost;
}

interface ChatBoostRemoved {
  chat: Chat;
  boost: ChatBoost;
}

interface ChatBoost {
  boost_id: string;
  add_date: number;
  expiration_date: number;
  source: ChatBoostSource;
}

interface ChatBoostSource {
  source: string;
  user?: TelegramUser;
  giveaway_message?: Message;
  giveaway_winner_count?: number;
  unclaimed_prize_count?: number;
  giveaway_message_id?: number;
}

export class TGService {
  private readonly api: AxiosInstance;
  private readonly baseUrl: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Telegram bot token is required');
    }

    this.baseUrl = `https://api.telegram.org/bot${token}`;

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response) {
          const telegramError = error.response.data as TelegramResponse<never>;
          throw new Error(
            `Telegram API Error: ${telegramError.description || error.message}`
          );
        }
        throw error;
      }
    );
  }

  private async request<T>(
    method: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<TelegramResponse<T>> = await this.api.post(
        method,
        params,
        config
      );

      if (!response.data.ok) {
        throw new Error(response.data.description || 'Unknown error occurred');
      }

      return response.data.result as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Telegram API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * A simple method for testing your bot's authentication token.
   * Returns basic information about the bot in form of a User object.
   */
  async getMe(): Promise<TelegramUser> {
    return this.request<TelegramUser>('getMe');
  }

  /**
   * Send a message to a chat
   * @param chatId Unique identifier for the target chat
   * @param text Text of the message to be sent
   * @param params Additional parameters for the message
   */
  async sendMessage(
    chatId: number | string,
    text: string,
    params?: Record<string, any>
  ): Promise<any> {
    return this.request('sendMessage', {
      chat_id: chatId,
      text,
      ...params,
    });
  }

  /**
   * Use this method to receive incoming updates using long polling.
   * @param params Optional parameters for the getUpdates method
   * @returns Array of Update objects
   */
  async getUpdates(params?: GetUpdatesParams): Promise<TelegramUpdate[]> {
    return this.request<TelegramUpdate[]>('getUpdates', params);
  }

  /**
   * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded.
   * @param chatId Unique identifier for the target chat or username of the target channel
   * @param fromChatId Unique identifier for the chat where the original message was sent
   * @param messageId Message identifier in the chat specified in from_chat_id
   * @param params Additional parameters for the forward message
   */
  async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    params?: {
      message_thread_id?: number;
      video_start_timestamp?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
    }
  ): Promise<any> {
    return this.request('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...params,
    });
  }
}
