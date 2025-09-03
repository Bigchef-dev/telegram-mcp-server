import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ITelegramClient } from '../domain/ports.js';
import {
  TelegramResponse,
  TelegramUser,
  TelegramUpdate,
  GetUpdatesParams,
  Message,
  ForwardMessageParams
} from '../../../types/telegram/index.js';
  TelegramUser,
  TelegramUpdate,
  GetUpdatesParams,
  Message,
  ForwardMessageParams
} from '../../../domain/types.js';

/**
 * Telegram Bot API Client Implementation
 * Infrastructure adapter for Telegram Bot API
 */
export class TGService implements ITelegramClient {
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
  ): Promise<Message> {
    return this.request<Message>('sendMessage', {
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
    params?: ForwardMessageParams
  ): Promise<Message> {
    return this.request<Message>('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...params,
    });
  }
}
