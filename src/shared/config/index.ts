import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration
 * Centralized configuration management with validation
 */
export interface AppConfig {
  telegram: {
    token: string;
  };
  env: string;
}

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): AppConfig {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!telegramToken) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is required');
  }

  return {
    telegram: {
      token: telegramToken,
    },
    env: process.env.NODE_ENV || 'development',
  };
}
