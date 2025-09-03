import { TelegramUser } from '../../../types/index.js';
import { BaseTelegramService } from '../base/telegram.base.service.js';

/**
 * Telegram Authentication Service
 * Handles bot authentication and basic info
 */
export class TelegramAuthService extends BaseTelegramService {
  /**
   * A simple method for testing your bot's authentication token.
   * Returns basic information about the bot in form of a User object.
   */
  async getMe(): Promise<TelegramUser> {
    return this.request<TelegramUser>('getMe');
  }

  /**
   * Use this method to log out from the cloud Bot API server before launching the bot locally.
   */
  async logOut(): Promise<boolean> {
    return this.request<boolean>('logOut');
  }

  /**
   * Use this method to close the bot instance before moving it from one local server to another.
   */
  async close(): Promise<boolean> {
    return this.request<boolean>('close');
  }
}
