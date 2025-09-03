import { TGService } from '../telegram.client.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Skip these tests by default to avoid unnecessary API calls
// Run with: npm test -- --testPathPattern=integration
describe('TGService Integration Tests', () => {
  let tgService: TGService;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  beforeAll(() => {
    if (!BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is required for integration tests');
    }
    tgService = new TGService(BOT_TOKEN);
  });

  it('should get bot information', async () => {
    const result = await tgService.getMe();
    
    // Verify the response structure
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('is_bot', true);
    expect(result).toHaveProperty('first_name');
    expect(result).toHaveProperty('username');
  });

  it('should send a message to a chat', async () => {
    // Replace with your actual chat ID
    const TEST_CHAT_ID = process.env.TEST_CHAT_ID;
    if (!TEST_CHAT_ID) {
      throw new Error('TEST_CHAT_ID environment variable is required for integration tests');
    }

    const result = await tgService.sendMessage(TEST_CHAT_ID, 'Integration test message');
    
    // Verify the response structure
    expect(result).toHaveProperty('message_id');
    expect(result).toHaveProperty('chat');
    expect(result.chat).toHaveProperty('id', Number(TEST_CHAT_ID));
    expect(result).toHaveProperty('text', 'Integration test message');
  });

  it('should get updates', async () => {
    const result = await tgService.getUpdates();
    console.log(result);
    // Verify the response structure
    expect(Array.isArray(result)).toBe(true);
    // Each update should have an update_id
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('update_id');
    }
  });
}); 