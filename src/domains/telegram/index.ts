/**
 * Telegram Domain Public API
 * Exports public interfaces and implementations
 */

// Domain types
export type {
  TelegramUser,
  TelegramUpdate,
  Message,
  Chat,
  GetUpdatesParams,
  ForwardMessageParams,
} from './domain/types.js';

// Domain ports (interfaces)
export type { ITelegramClient } from './domain/ports.js';

// Infrastructure implementations
export { TGService } from './infrastructure/telegram.client.js';
