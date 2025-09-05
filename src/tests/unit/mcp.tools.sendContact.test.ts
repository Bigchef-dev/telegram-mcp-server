import { SendContactTool } from '../../mcp/tools/sendContact.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { Message } from '../../types/index.js';
import { createMockTelegramClient } from '../__mocks__/telegramClient.js';

describe('SendContactTool', () => {
  let mockTelegramClient: jest.Mocked<ITelegramClient>;
  let tool: SendContactTool;

  beforeEach(() => {
    mockTelegramClient = createMockTelegramClient();
    tool = new SendContactTool(mockTelegramClient);
    jest.clearAllMocks();
  });

  describe('Tool Configuration', () => {
    it('should have correct name', () => {
      expect(tool.name).toBe('send_contact');
    });

    it('should have descriptive description', () => {
      expect(tool.description).toContain('Send phone contacts');
    });

    it('should have valid parameter schema', () => {
      const schema = tool.parametersSchema;
      expect(schema).toBeDefined();
      expect(schema.shape.chatId).toBeDefined();
      expect(schema.shape.phoneNumber).toBeDefined();
      expect(schema.shape.firstName).toBeDefined();
    });
  });

  describe('Parameter Validation', () => {
    it('should accept valid contact parameters', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John'
      });
      expect(result.success).toBe(true);
    });

    it('should accept string chat_id', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: '@testchannel',
        phoneNumber: '+1234567890',
        firstName: 'John'
      });
      expect(result.success).toBe(true);
    });

    it('should accept optional lastName', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John',
        lastName: 'Doe'
      });
      expect(result.success).toBe(true);
    });

    it('should accept optional vcard', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John',
        vcard: 'BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nEND:VCARD'
      });
      expect(result.success).toBe(true);
    });

    it('should require chatId parameter', () => {
      const result = tool.parametersSchema.safeParse({
        phoneNumber: '+1234567890',
        firstName: 'John'
      });
      expect(result.success).toBe(false);
    });

    it('should require phoneNumber parameter', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: 123456789,
        firstName: 'John'
      });
      expect(result.success).toBe(false);
    });

    it('should require firstName parameter', () => {
      const result = tool.parametersSchema.safeParse({
        chatId: 123456789,
        phoneNumber: '+1234567890'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Execute Method', () => {
    const mockMessage: Message = {
      message_id: 123,
      date: 1234567890,
      chat: {
        id: 123456789,
        type: 'private'
      }
    };

    it('should successfully send contact with required parameters', async () => {
      (mockTelegramClient.sendContact as jest.Mock).mockResolvedValue(mockMessage);

      const result = await tool.execute({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John'
      });

      expect(mockTelegramClient.sendContact).toHaveBeenCalledWith(
        123456789,
        '+1234567890',
        'John',
        {}
      );
      expect(result.content[0].text).toContain('"message_id": 123');
    });

    it('should successfully send contact with optional parameters', async () => {
      (mockTelegramClient.sendContact as jest.Mock).mockResolvedValue(mockMessage);

      const result = await tool.execute({
        chatId: '@testchannel',
        phoneNumber: '+1234567890',
        firstName: 'John',
        lastName: 'Doe',
        vcard: 'BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nEND:VCARD',
        disableNotification: true
      });

      expect(mockTelegramClient.sendContact).toHaveBeenCalledWith(
        '@testchannel',
        '+1234567890',
        'John',
        {
          last_name: 'Doe',
          vcard: 'BEGIN:VCARD\\nVERSION:3.0\\nFN:John Doe\\nEND:VCARD',
          disable_notification: true
        }
      );
      expect(result.content[0].text).toContain('"message_id": 123');
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('Contact sending failed');
      (mockTelegramClient.sendContact as jest.Mock).mockRejectedValue(error);

      const result = await tool.execute({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John'
      });

      expect(result.content[0].text).toContain('"error": "Contact sending failed"');
    });

    it('should transform camelCase parameters to snake_case', async () => {
      (mockTelegramClient.sendContact as jest.Mock).mockResolvedValue(mockMessage);

      await tool.execute({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John',
        businessConnectionId: 'business123',
        messageThreadId: 456,
        protectContent: true
      });

      expect(mockTelegramClient.sendContact).toHaveBeenCalledWith(
        123456789,
        '+1234567890',
        'John',
        {
          business_connection_id: 'business123',
          message_thread_id: 456,
          protect_content: true
        }
      );
    });
  });

  describe('Response Format', () => {
    it('should return JSON formatted response', async () => {
      const mockMessage: Message = {
        message_id: 123,
        date: 1234567890,
        chat: {
          id: 123456789,
          type: 'private'
        }
      };

      (mockTelegramClient.sendContact as jest.Mock).mockResolvedValue(mockMessage);

      const result = await tool.execute({
        chatId: 123456789,
        phoneNumber: '+1234567890',
        firstName: 'John'
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      
      const parsedResponse = JSON.parse(result.content[0].text as string);
      expect(parsedResponse).toEqual(mockMessage);
    });
  });
});
