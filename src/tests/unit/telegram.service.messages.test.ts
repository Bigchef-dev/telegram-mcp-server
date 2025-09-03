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
      if (url === 'unpinAllChatMessages') {
        return Promise.resolve({ data: { ok: true, result: true } });
      }
      if (url === 'sendPoll') {
        return Promise.resolve({ 
          data: { 
            ok: true, 
            result: {
              message_id: 123,
              date: 1234567890,
              chat: { id: 123456789, type: 'group' },
              poll: {
                id: 'poll123',
                question: 'Test poll?',
                options: [
                  { text: 'Option 1', voter_count: 0 },
                  { text: 'Option 2', voter_count: 0 }
                ],
                total_voter_count: 0,
                is_closed: false,
                is_anonymous: true,
                type: 'regular',
                allows_multiple_answers: false
              }
            }
          }
        });
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

  describe('unpinAllChatMessages', () => {
    it('should unpin all messages successfully', async () => {
      const chatId = 123456789;

      const result = await tgService.unpinAllChatMessages(chatId);

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'unpinAllChatMessages',
        {
          chat_id: chatId,
        },
        undefined
      );
    });

    it('should work with channel username', async () => {
      const chatId = '@testchannel';

      const result = await tgService.unpinAllChatMessages(chatId);

      expect(result).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'unpinAllChatMessages',
        {
          chat_id: chatId,
        },
        undefined
      );
    });
  });

  describe('sendPoll', () => {
    it('should send poll successfully', async () => {
      const pollParams = {
        chat_id: 123456789,
        question: 'What is your favorite color?',
        options: [
          { text: 'Red' },
          { text: 'Blue' }
        ]
      };
      
      const result = await tgService.sendPoll(pollParams);

      expect(result.poll).toBeDefined();
      expect(result.poll?.question).toBe('Test poll?');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'sendPoll',
        pollParams,
        undefined
      );
    });

    it('should send quiz poll with correct answer', async () => {
      const quizParams = {
        chat_id: 123456789,
        question: 'What is 2+2?',
        options: [
          { text: '3' },
          { text: '4' },
          { text: '5' }
        ],
        type: 'quiz' as const,
        correct_option_id: 1,
        explanation: '2+2 equals 4'
      };
      
      const result = await tgService.sendPoll(quizParams);

      expect(result.poll).toBeDefined();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'sendPoll',
        quizParams,
        undefined
      );
    });

    it('should send anonymous poll with multiple answers', async () => {
      const multiParams = {
        chat_id: '@testchannel',
        question: 'Select all that apply:',
        options: [
          { text: 'Option A' },
          { text: 'Option B' },
          { text: 'Option C' }
        ],
        is_anonymous: false,
        allows_multiple_answers: true,
        open_period: 300
      };
      
      const result = await tgService.sendPoll(multiParams);

      expect(result.poll).toBeDefined();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'sendPoll',
        multiParams,
        undefined
      );
    });
  });
});
