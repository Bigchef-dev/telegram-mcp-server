import axios from 'axios';
import { TGService } from '../service.js';
import { mockTelegramApi } from './__mocks__/telegramApi.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create
const mockAxiosInstance = {
  post: jest.fn().mockImplementation((url, data, config) => {
    return Promise.resolve({ data: mockTelegramApi[url as keyof typeof mockTelegramApi] });
  }),
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
};
mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('TGService', () => {
  let tgService: TGService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    tgService = new TGService('test-token');
  });

  describe('constructor', () => {
    it('should throw error if token is not provided', () => {
      expect(() => new TGService('')).toThrow('Telegram bot token is required');
    });

    it('should initialize with valid token', () => {
      expect(tgService).toBeInstanceOf(TGService);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.telegram.org/bottest-token',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('getMe', () => {
    it('should return bot information', async () => {
      const result = await tgService.getMe();
      expect(result).toEqual(mockTelegramApi.getMe.result);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'getMe',
        undefined,
        undefined
      );
    });
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
});