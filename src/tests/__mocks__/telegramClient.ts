import { ITelegramClient } from '../../domain/ports/index.js';

/**
 * Shared mock implementation of ITelegramClient for testing
 * This eliminates duplication across test files and provides consistent mocking
 */
export const createMockTelegramClient = (): jest.Mocked<ITelegramClient> => ({
  getMe: jest.fn(),
  sendMessage: jest.fn(),
  getUpdates: jest.fn(),
  forwardMessage: jest.fn(),
  pinChatMessage: jest.fn(),
  unpinChatMessage: jest.fn(),
  unpinAllChatMessages: jest.fn(),
  getChat: jest.fn(),
  sendPoll: jest.fn(),
  sendContact: jest.fn()
});

/**
 * Default mock instance for convenience
 * Can be used directly or call createMockTelegramClient() for fresh instances
 */
export const mockTelegramClient = createMockTelegramClient();

/**
 * Helper function to reset all mocks in the shared instance
 */
export const resetMockTelegramClient = (): void => {
  Object.values(mockTelegramClient).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
};
