import { BaseTelegramService } from '../base/telegram.base.service.js';
import { GetChatParams, ChatFullInfo, TelegramResponse } from '../../../types/telegram/index.js';

/**
 * Telegram Chat Service
 * Handles chat-related operations
 */
export class TelegramChatService extends BaseTelegramService {
  /**
   * Get up-to-date information about the chat
   * @param params - Parameters for getting chat information
   * @returns Promise with chat information
   */
  async getChat(params: GetChatParams): Promise<ChatFullInfo> {
    return this.request<ChatFullInfo>('getChat', params);
  }
}
