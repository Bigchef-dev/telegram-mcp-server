import axios from 'axios';
import { mockTelegramApi } from '../__mocks__/telegramApi.js';

// Mock axios
jest.mock('axios');
export const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create
export const mockAxiosInstance = {
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

/**
 * Reset all mocks - to be called in beforeEach
 */
export const resetMocks = () => {
  jest.clearAllMocks();
};
