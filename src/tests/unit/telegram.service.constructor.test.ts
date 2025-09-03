import { TGService } from '../../telegram.client.js';

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

describe('TGService - Constructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if token is not provided', () => {
      expect(() => new TGService('')).toThrow('Telegram bot token is required');
    });

    it('should initialize with valid token', () => {
      const tgService = new TGService('test-token');
      
      expect(tgService).toBeInstanceOf(TGService);
      // TGService creates 4 services (auth, message, updates, chat), each calling axios.create
      expect(mockedAxios.create).toHaveBeenCalledTimes(4);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.telegram.org/bottest-token',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
});
