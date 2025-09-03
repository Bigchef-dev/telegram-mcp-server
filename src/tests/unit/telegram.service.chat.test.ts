import { TGService } from '../../telegram.client.js';
import { ChatFullInfo } from '../../types/telegram/index.js';

// Mock axios directly in this test file
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
  post: jest.fn(),
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('TGService - Chat', () => {
  let tgService: TGService;

  beforeEach(() => {
    jest.clearAllMocks();
    tgService = new TGService('test-token');
  });

  describe('chat service access', () => {
    it('should provide access to chat service', () => {
      expect(tgService.chat).toBeDefined();
      expect(typeof tgService.chat).toBe('object');
    });
  });

  describe('getChat method', () => {
    const mockChatInfo: ChatFullInfo = {
      id: 123456789,
      type: 'supergroup',
      title: 'Test Chat',
      username: 'testchat',
      description: 'A test chat for unit testing',
      permissions: {
        can_send_messages: true,
        can_send_photos: true,
        can_invite_users: true
      }
    };

    it('should get chat information successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          ok: true,
          result: mockChatInfo,
        },
      });

      const result = await tgService.getChat(123456789);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('getChat', { chat_id: 123456789 }, undefined);
      expect(result).toEqual(mockChatInfo);
    });

    it('should handle string chat ID', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          ok: true,
          result: mockChatInfo,
        },
      });

      await tgService.getChat('@testchat');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('getChat', { chat_id: '@testchat' }, undefined);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          ok: false,
          description: 'Chat not found',
        },
      });

      await expect(tgService.getChat(999999999)).rejects.toThrow('Chat not found');
    });

    it('should handle network errors', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      await expect(tgService.getChat(123456789)).rejects.toThrow('Telegram API request failed: Network error');
    });
  });
});
