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
});
