import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TelegramResponse } from '../../../types/index.js';
import { TelegramApiError, TelegramAuthError, TelegramRateLimitError } from './telegram.errors.js';

/**
 * Base Telegram HTTP Client
 * Shared HTTP client with error handling and request logic
 */
export abstract class BaseTelegramService {
  protected readonly api: AxiosInstance;
  protected readonly baseUrl: string;

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

  /**
   * Make a request to Telegram API
   * @param method API method name
   * @param params Request parameters
   * @param config Additional axios config
   */
  protected async request<T>(
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
}
