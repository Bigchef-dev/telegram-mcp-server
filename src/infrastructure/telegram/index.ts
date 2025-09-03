/**
 * Infrastructure - Telegram Module
 * Modular Telegram API client with specialized services
 */

// Main facade service (backward compatible with ITelegramClient)
export { TelegramService } from './telegram.service.js';

// Specialized services for advanced usage
export * from './base/index.js';
export * from './services/index.js';

// Legacy export alias for backward compatibility
export { TelegramService as TGService } from './telegram.service.js';
