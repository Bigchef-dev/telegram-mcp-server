/**
 * Telegram API Specific Errors
 * Typed errors for better error handling
 */

export class TelegramApiError extends Error {
  constructor(
    message: string,
    public readonly errorCode?: number,
    public readonly description?: string
  ) {
    super(message);
    this.name = 'TelegramApiError';
  }
}

export class TelegramAuthError extends TelegramApiError {
  constructor(message: string, description?: string) {
    super(message, 401, description);
    this.name = 'TelegramAuthError';
  }
}

export class TelegramRateLimitError extends TelegramApiError {
  constructor(message: string, public readonly retryAfter?: number) {
    super(message, 429);
    this.name = 'TelegramRateLimitError';
  }
}
