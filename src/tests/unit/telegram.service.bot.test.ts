import { TGService } from '../../telegram.client.js';
import { mockAxiosInstance, resetMocks } from '../setup/test.setup.js';
import { mockTelegramApi } from '../__mocks__/telegramApi.js';

// Setup mocks properly
jest.mock('axios');

describe('TGService - Bot Info', () => {
  let tgService: TGService;

  beforeEach(() => {
    resetMocks();
    // Mock the specific response for this test
    mockAxiosInstance.post.mockImplementation((url) => {
      if (url === 'getMe') {
        return Promise.resolve({ data: mockTelegramApi.getMe });
      }
      return Promise.reject(new Error('Not Found'));
    });
    tgService = new TGService('test-token');
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
});
