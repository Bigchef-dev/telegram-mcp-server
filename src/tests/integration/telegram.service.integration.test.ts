import { TGService } from '../../telegram.client.js';
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

  it('should send a poll to a chat', async () => {
    // Replace with your actual chat ID
    const TEST_CHAT_ID = process.env.TEST_CHAT_ID;
    if (!TEST_CHAT_ID) {
      throw new Error('TEST_CHAT_ID environment variable is required for integration tests');
    }

    const pollParams = {
      chat_id: TEST_CHAT_ID,
      question: 'Integration Test: What is your favorite programming language?',
      options: [
        { text: 'JavaScript' },
        { text: 'TypeScript' },
        { text: 'Python' },
        { text: 'Java' },
        { text: 'C#' },
        { text: 'Go' },
        { text: 'Rust' },
        { text: 'Swift' }
      ], // 8 options (within 2-10 limit)
      is_anonymous: false, // Make it public to test different options
      allows_multiple_answers: true // Allow multiple selections
    };

    const result = await tgService.sendPoll(pollParams);
    
    // Verify the response structure
    expect(result).toHaveProperty('message_id');
    expect(result).toHaveProperty('chat');
    expect(result.chat).toHaveProperty('id', Number(TEST_CHAT_ID));
    expect(result).toHaveProperty('poll');
    expect(result.poll).toHaveProperty('id');
    expect(result.poll).toHaveProperty('question', 'Integration Test: What is your favorite programming language?');
    expect(result.poll).toHaveProperty('options');
    expect(result.poll?.options).toHaveLength(4);
    expect(result.poll).toHaveProperty('is_anonymous', true);
    expect(result.poll).toHaveProperty('allows_multiple_answers', false);
    expect(result.poll).toHaveProperty('type', 'regular');
    expect(result.poll).toHaveProperty('is_closed', false);
  });

  it('should send a quiz poll to a chat', async () => {
    // Replace with your actual chat ID
    const TEST_CHAT_ID = process.env.TEST_CHAT_ID;
    if (!TEST_CHAT_ID) {
      throw new Error('TEST_CHAT_ID environment variable is required for integration tests');
    }

    const quizParams = {
      chat_id: TEST_CHAT_ID,
      question: 'Integration Test Quiz: What is 2 + 2?',
      options: [
        { text: '3' },
        { text: '4' },
        { text: '5' },
        { text: '22' }
      ],
      type: 'quiz' as const,
      correct_option_id: 1, // Index 1 = "4"
      explanation: 'The correct answer is 4. Basic mathematics!',
      is_anonymous: false,
      open_period: 60 // 1 minute
    };

    const result = await tgService.sendPoll(quizParams);
    
    // Verify the response structure for quiz
    expect(result).toHaveProperty('message_id');
    expect(result).toHaveProperty('chat');
    expect(result.chat).toHaveProperty('id', Number(TEST_CHAT_ID));
    expect(result).toHaveProperty('poll');
    expect(result.poll).toHaveProperty('id');
    expect(result.poll).toHaveProperty('question', 'Integration Test Quiz: What is 2 + 2?');
    expect(result.poll).toHaveProperty('type', 'quiz');
    expect(result.poll).toHaveProperty('correct_option_id', 1);
    expect(result.poll).toHaveProperty('explanation', 'The correct answer is 4. Basic mathematics!');
    expect(result.poll).toHaveProperty('is_anonymous', false);
  });
}); 