/**
 * Domain Ports (Interfaces)
 * Contracts for external adapters in the telegram domain
 */

import {
  TelegramUser,
  TelegramUpdate,
  GetUpdatesParams,
  Message,
  ForwardMessageParams
} from './types/index.js';

/**
 * Interface for Telegram Bot API Client
 * Defines the contract for interacting with Telegram's API
 */
export interface ITelegramClient {
  /**
   * Test bot authentication token and get bot information
   */
  getMe(): Promise<TelegramUser>;

  /**
   * Send a text message to a chat
   * @param chatId Unique identifier for the target chat
   * @param text Text of the message to be sent
   * @param params Additional message parameters
   */
  sendMessage(
    chatId: number | string,
    text: string,
    params?: Record<string, any>
  ): Promise<Message>;

  /**
   * Receive incoming updates using long polling
   * @param params Optional parameters for the getUpdates method
   */
  getUpdates(params?: GetUpdatesParams): Promise<TelegramUpdate[]>;

  /**
   * Forward messages of any kind
   * @param chatId Target chat identifier
   * @param fromChatId Source chat identifier
   * @param messageId Message identifier to forward
   * @param params Additional forward parameters
   */
  forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    params?: ForwardMessageParams
  ): Promise<Message>;
}
