import { ITelegramClient } from '../../domain/ports/index.js';
import {
  TelegramUser,
  TelegramUpdate,
  GetUpdatesParams,
  Message,
  ForwardMessageParams,
  PinChatMessageParams,
  UnpinChatMessageParams,
  UnpinAllChatMessagesParams
} from '../../types/index.js';
import { TelegramAuthService } from './services/telegram.auth.service.js';
import { TelegramMessageService } from './services/telegram.message.service.js';
import { TelegramUpdatesService } from './services/telegram.updates.service.js';

/**
 * Unified Telegram Service Facade
 * Implements ITelegramClient by delegating to specialized services
 * This maintains backward compatibility while providing modular architecture
 */
export class TelegramService implements ITelegramClient {
  private readonly authService: TelegramAuthService;
  private readonly messageService: TelegramMessageService;
  private readonly updatesService: TelegramUpdatesService;

  constructor(token: string) {
    // Initialize all specialized services with the same token
    this.authService = new TelegramAuthService(token);
    this.messageService = new TelegramMessageService(token);
    this.updatesService = new TelegramUpdatesService(token);
  }

  // Delegate to auth service
  async getMe(): Promise<TelegramUser> {
    return this.authService.getMe();
  }

  // Delegate to message service
  async sendMessage(
    chatId: number | string,
    text: string,
    params?: Record<string, any>
  ): Promise<Message> {
    return this.messageService.sendMessage(chatId, text, params);
  }

  async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    params?: ForwardMessageParams
  ): Promise<Message> {
    return this.messageService.forwardMessage(chatId, fromChatId, messageId, params);
  }

  async pinChatMessage(
    chatId: number | string,
    messageId: number,
    params?: Omit<PinChatMessageParams, 'chat_id' | 'message_id'>
  ): Promise<boolean> {
    return this.messageService.pinChatMessage(chatId, messageId, params);
  }

  async unpinChatMessage(
    chatId: number | string,
    messageId?: number,
    params?: Omit<UnpinChatMessageParams, 'chat_id' | 'message_id'>
  ): Promise<boolean> {
    return this.messageService.unpinChatMessage(chatId, messageId, params);
  }

  async unpinAllChatMessages(
    chatId: number | string
  ): Promise<boolean> {
    return this.messageService.unpinAllChatMessages(chatId);
  }

  // Delegate to updates service
  async getUpdates(params?: GetUpdatesParams): Promise<TelegramUpdate[]> {
    return this.updatesService.getUpdates(params);
  }

  // Expose specialized services for advanced usage
  get auth(): TelegramAuthService {
    return this.authService;
  }

  get messages(): TelegramMessageService {
    return this.messageService;
  }

  get updates(): TelegramUpdatesService {
    return this.updatesService;
  }
}
