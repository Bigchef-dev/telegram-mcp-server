import { TGService } from '../../telegram.client.js';
import { mockAxiosInstance, resetMocks } from '../setup/test.setup.js';
import { mockTelegramApi } from '../__mocks__/telegramApi.js';

// Setup mocks properly
jest.mock('axios');

describe('TGService - Messages', () => {
  let tgService: TGService;

  beforeEach(() => {
    resetMocks();
    // Mock the specific responses for message tests
    mockAxiosInstance.post.mockImplementation((url) => {
      if (url === 'sendMessage') {
        return Promise.resolve({ data: mockTelegramApi.sendMessage });
      }
      if (url === 'pinChatMessage') {
        return Promise.resolve({ data: { ok: true, result: true } });
      }
      if (url === 'unpinChatMessage') {
        return Promise.resolve({ data: { ok: true, result: true } });
      }
      return Promise.reject(new Error('Not Found'));
    });
    tgService = new TGService('test-token');
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const chatId = 123456789;
      const text = 'Test message';
      
      const result = await tgService.sendMessage(chatId, text);

      expect(result).toEqual(mockTelegramApi.sendMessage.result);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'sendMessage',
        {
          chat_id: chatId,
          text,
        },
        undefined
      );
    });

    it('should handle additional parameters', async () => {
      const chatId = 123456789;
      const text = 'Test message';
      const params = { parse_mode: 'HTML' };
      
      await tgService.sendMessage(chatId, text, params);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'sendMessage',
        {
          chat_id: chatId,
          text,
          ...params,
        },
        undefined
      );
    });
  });

  describe('pinChatMessage', () => {
    it('should pin message successfully', async () => {
      const chatId = 123456789;
      const messageId = 12345;

      const result = await tgService.pinChatMessage(chatId, messageId);

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'pinChatMessage',
        {
          chat_id: chatId,
          message_id: messageId,
        },
        undefined
      );
    });

    it('should handle additional parameters for pinning', async () => {
      const chatId = 123456789;
      const messageId = 12345;
      const params = { 
        business_connection_id: 'business123',
        disable_notification: true 
      };

      await tgService.pinChatMessage(chatId, messageId, params);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'pinChatMessage',
        {
          chat_id: chatId,
          message_id: messageId,
          ...params,
        },
        undefined
      );
    });
  });

  describe('unpinChatMessage', () => {
    it('should unpin specific message successfully', async () => {
      const chatId = 123456789;
      const messageId = 12345;

      const result = await tgService.unpinChatMessage(chatId, messageId);

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'unpinChatMessage',
        {
          chat_id: chatId,
          message_id: messageId,
        },
        undefined
      );
    });

    it('should unpin most recent message when no messageId provided', async () => {
      const chatId = 123456789;

      const result = await tgService.unpinChatMessage(chatId);

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'unpinChatMessage',
        {
          chat_id: chatId,
        },
        undefined
      );
    });

    it('should handle additional parameters for unpinning', async () => {
      const chatId = '@testchannel';
      const messageId = 12345;
      const params = { 
        business_connection_id: 'business123'
      };

      await tgService.unpinChatMessage(chatId, messageId, params);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'unpinChatMessage',
        {
          chat_id: chatId,
          message_id: messageId,
          ...params,
        },
        undefined
      );
    });
  });
});
