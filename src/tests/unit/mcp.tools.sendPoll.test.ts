/**
 * Unit tests for SendPoll MCP Tool
 */

import { SendPollTool } from '../../mcp/tools/sendPoll.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { Message, SendPollParams } from '../../types/index.js';
import { createMockTelegramClient } from '../__mocks__/telegramClient.js';

describe('SendPollTool', () => {
  let mockTelegramClient: jest.Mocked<ITelegramClient>;
  let sendPollTool: SendPollTool;
  const mockMessage: Message = {
    message_id: 123,
    date: 1234567890,
    chat: {
      id: -1001234567890,
      type: 'supergroup',
      title: 'Test Group'
    },
    poll: {
      id: 'poll123',
      question: 'What is your favorite color?',
      options: [
        { text: 'Red', voter_count: 0 },
        { text: 'Blue', voter_count: 0 }
      ],
      total_voter_count: 0,
      is_closed: false,
      is_anonymous: true,
      type: 'regular',
      allows_multiple_answers: false
    }
  } as Message;

  beforeEach(() => {
    mockTelegramClient = createMockTelegramClient();
    sendPollTool = new SendPollTool(mockTelegramClient);
    jest.clearAllMocks();
  });

  describe('Tool Properties', () => {
    it('should have correct name and description', () => {
      expect(sendPollTool.name).toBe('sendPoll');
      expect(sendPollTool.description).toContain('Send a native poll');
    });

    it('should have valid parameter schema', () => {
      const schema = sendPollTool.parametersSchema;
      expect(schema).toBeDefined();
      
      // Test required fields
      const validParams = {
        chat_id: -1001234567890,
        question: 'What is your favorite color?',
        options: [
          { text: 'Red' },
          { text: 'Blue' }
        ]
      };
      
      expect(() => schema.parse(validParams)).not.toThrow();
    });
  });

  describe('execute', () => {
    const validParams: SendPollParams = {
      chat_id: -1001234567890,
      question: 'What is your favorite color?',
      options: [
        { text: 'Red' },
        { text: 'Blue' }
      ]
    };

    it('should send poll successfully', async () => {
      mockTelegramClient.sendPoll.mockResolvedValue(mockMessage);

      const result = await sendPollTool.execute(validParams);

      expect(mockTelegramClient.sendPoll).toHaveBeenCalledWith(validParams);
      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toEqual(mockMessage);
    });

    it('should send poll with quiz type', async () => {
      const quizParams: SendPollParams = {
        ...validParams,
        type: 'quiz',
        correct_option_id: 0,
        explanation: 'Red is the correct answer!'
      };

      mockTelegramClient.sendPoll.mockResolvedValue(mockMessage);

      const result = await sendPollTool.execute(quizParams);

      expect(mockTelegramClient.sendPoll).toHaveBeenCalledWith(quizParams);
      expect(result.content).toBeDefined();
      
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
    });

    it('should send poll with additional options', async () => {
      const advancedParams: SendPollParams = {
        ...validParams,
        is_anonymous: false,
        allows_multiple_answers: true,
        open_period: 300,
        disable_notification: true,
        protect_content: true
      };

      mockTelegramClient.sendPoll.mockResolvedValue(mockMessage);

      const result = await sendPollTool.execute(advancedParams);

      expect(mockTelegramClient.sendPoll).toHaveBeenCalledWith(advancedParams);
      expect(result.content).toBeDefined();
      
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
    });

    it('should handle API errors', async () => {
      const error = new Error('Telegram API Error: Bad Request');
      mockTelegramClient.sendPoll.mockRejectedValue(error);

      const result = await sendPollTool.execute(validParams);

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.error).toBe('Telegram API Error: Bad Request');
    });

    it('should handle unknown errors', async () => {
      mockTelegramClient.sendPoll.mockRejectedValue('Unknown error');

      const result = await sendPollTool.execute(validParams);

      expect(result.content).toBeDefined();
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.error).toBe('Unknown error occurred');
    });
  });

  describe('Parameter Validation', () => {
    it('should validate minimum options count', () => {
      const invalidParams = {
        chat_id: -1001234567890,
        question: 'Test?',
        options: [{ text: 'Only one option' }]
      };

      expect(() => sendPollTool.parametersSchema.parse(invalidParams)).toThrow();
    });

    it('should validate maximum options count', () => {
      const tooManyOptions = Array.from({ length: 13 }, (_, i) => ({ text: `Option ${i + 1}` }));
      const invalidParams = {
        chat_id: -1001234567890,
        question: 'Test?',
        options: tooManyOptions
      };

      expect(() => sendPollTool.parametersSchema.parse(invalidParams)).toThrow();
    });

    it('should validate question length', () => {
      const longQuestion = 'a'.repeat(301);
      const invalidParams = {
        chat_id: -1001234567890,
        question: longQuestion,
        options: [{ text: 'A' }, { text: 'B' }]
      };

      expect(() => sendPollTool.parametersSchema.parse(invalidParams)).toThrow();
    });

    it('should validate explanation length', () => {
      const longExplanation = 'a'.repeat(201);
      const invalidParams = {
        chat_id: -1001234567890,
        question: 'Test?',
        options: [{ text: 'A' }, { text: 'B' }],
        explanation: longExplanation
      };

      expect(() => sendPollTool.parametersSchema.parse(invalidParams)).toThrow();
    });

    it('should validate open_period range', () => {
      const invalidParams1 = {
        chat_id: -1001234567890,
        question: 'Test?',
        options: [{ text: 'A' }, { text: 'B' }],
        open_period: 4 // Too low
      };

      const invalidParams2 = {
        chat_id: -1001234567890,
        question: 'Test?',
        options: [{ text: 'A' }, { text: 'B' }],
        open_period: 601 // Too high
      };

      expect(() => sendPollTool.parametersSchema.parse(invalidParams1)).toThrow();
      expect(() => sendPollTool.parametersSchema.parse(invalidParams2)).toThrow();
    });
  });
});
