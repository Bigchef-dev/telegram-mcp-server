import { ITelegramClient } from '../ports.js';
import { TelegramUpdate, TelegramUser } from '../types/index.js';

/**
 * Example Use Case: Process Telegram Updates
 * Application layer orchestration for handling Telegram updates
 */
export class ProcessUpdateUseCase {
  constructor(private readonly telegramClient: ITelegramClient) {}

  /**
   * Get bot information for verification
   */
  async getBotInfo(): Promise<TelegramUser> {
    return this.telegramClient.getMe();
  }

  /**
   * Fetch pending updates from Telegram
   */
  async fetchUpdates(offset?: number): Promise<TelegramUpdate[]> {
    return this.telegramClient.getUpdates({
      offset,
      timeout: 30,
      limit: 100,
    });
  }

  /**
   * Process a single update
   * This is where business logic would be implemented
   */
  async processUpdate(update: TelegramUpdate): Promise<void> {
    if (update.message?.text) {
      // Example: Echo back the message
      await this.telegramClient.sendMessage(
        update.message.chat.id,
        `You said: ${update.message.text}`
      );
    }
  }

  /**
   * Process multiple updates in sequence
   */
  async processUpdates(updates: TelegramUpdate[]): Promise<void> {
    for (const update of updates) {
      try {
        await this.processUpdate(update);
      } catch (error) {
        console.error(`Failed to process update ${update.update_id}:`, error);
      }
    }
  }
}
