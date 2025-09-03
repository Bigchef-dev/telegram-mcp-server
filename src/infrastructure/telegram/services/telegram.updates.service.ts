import { TelegramUpdate, GetUpdatesParams } from '../../../types/index.js';
import { BaseTelegramService } from '../base/telegram.base.service.js';

/**
 * Telegram Updates Service
 * Handles updates and webhooks
 */
export class TelegramUpdatesService extends BaseTelegramService {
  /**
   * Use this method to receive incoming updates using long polling.
   * @param params Optional parameters for the getUpdates method
   * @returns Array of Update objects
   */
  async getUpdates(params?: GetUpdatesParams): Promise<TelegramUpdate[]> {
    return this.request<TelegramUpdate[]>('getUpdates', params);
  }

  /**
   * Use this method to specify a URL and receive incoming updates via an outgoing webhook.
   */
  async setWebhook(
    url: string,
    params?: Record<string, any>
  ): Promise<boolean> {
    return this.request<boolean>('setWebhook', {
      url,
      ...params,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates.
   */
  async deleteWebhook(dropPendingUpdates?: boolean): Promise<boolean> {
    return this.request<boolean>('deleteWebhook', {
      drop_pending_updates: dropPendingUpdates,
    });
  }

  /**
   * Use this method to get current webhook status.
   */
  async getWebhookInfo(): Promise<{
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    ip_address?: string;
    last_error_date?: number;
    last_error_message?: string;
    last_synchronization_error_date?: number;
    max_connections?: number;
    allowed_updates?: string[];
  }> {
    return this.request('getWebhookInfo');
  }
}
