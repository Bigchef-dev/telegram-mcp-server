import { GetChatTool } from '../../mcp/tools/getChat.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { ChatFullInfo } from '../../types/telegram/index.js';

// Mock implementation of ITelegramClient
const mockTelegramClient: ITelegramClient = {
  getMe: jest.fn(),
  sendMessage: jest.fn(),
  getUpdates: jest.fn(),
  forwardMessage: jest.fn(),
  pinChatMessage: jest.fn(),
  unpinChatMessage: jest.fn(),
  unpinAllChatMessages: jest.fn(),
  getChat: jest.fn()
};

describe('GetChatTool', () => {
  let tool: GetChatTool;

  beforeEach(() => {
    tool = new GetChatTool(mockTelegramClient);
    jest.clearAllMocks();
  });

  describe('Tool Configuration', () => {
    it('should have correct name', () => {
      expect(tool.name).toBe('getChat');
    });

    it('should have descriptive description', () => {
      expect(tool.description).toContain('Get up-to-date information about the chat');
    });

    it('should have valid parameter schema', () => {
      const schema = tool.parametersSchema;
      expect(schema).toBeDefined();
      expect(schema.shape.chat_id).toBeDefined();
    });
  });

  describe('Parameter Validation', () => {
    it('should accept numeric chat_id', () => {
      const result = tool.parametersSchema.safeParse({ chat_id: 123456789 });
      expect(result.success).toBe(true);
    });

    it('should accept string chat_id', () => {
      const result = tool.parametersSchema.safeParse({ chat_id: '@testchannel' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid chat_id types', () => {
      const result = tool.parametersSchema.safeParse({ chat_id: true });
      expect(result.success).toBe(false);
    });

    it('should require chat_id parameter', () => {
      const result = tool.parametersSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('Execute Method', () => {
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

    it('should successfully get chat info with numeric ID', async () => {
      (mockTelegramClient.getChat as jest.Mock).mockResolvedValue(mockChatInfo);

      const result = await tool.execute({ chat_id: 123456789 });

      expect(mockTelegramClient.getChat).toHaveBeenCalledWith(123456789);
      expect(result.content[0].text).toContain('"success": true');
      expect(result.content[0].text).toContain('"title": "Test Chat"');
    });

    it('should successfully get chat info with string ID', async () => {
      (mockTelegramClient.getChat as jest.Mock).mockResolvedValue(mockChatInfo);

      const result = await tool.execute({ chat_id: '@testchat' });

      expect(mockTelegramClient.getChat).toHaveBeenCalledWith('@testchat');
      expect(result.content[0].text).toContain('"success": true');
      expect(result.content[0].text).toContain('"username": "testchat"');
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('Chat not found');
      (mockTelegramClient.getChat as jest.Mock).mockRejectedValue(error);

      const result = await tool.execute({ chat_id: 999999999 });

      expect(result.content[0].text).toContain('"error": "Chat not found"');
    });

    it('should handle unknown errors', async () => {
      (mockTelegramClient.getChat as jest.Mock).mockRejectedValue('Unknown error');

      const result = await tool.execute({ chat_id: 123456789 });

      expect(result.content[0].text).toContain('"error": "Unknown error occurred"');
    });
  });

  describe('Response Format', () => {
    it('should return JSON formatted response', async () => {
      const mockChatInfo: ChatFullInfo = {
        id: 123456789,
        type: 'group',
        title: 'Test Group'
      };

      (mockTelegramClient.getChat as jest.Mock).mockResolvedValue(mockChatInfo);

      const result = await tool.execute({ chat_id: 123456789 });

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      
      const parsedResponse = JSON.parse(result.content[0].text as string);
      expect(parsedResponse.success).toBe(true);
      expect(parsedResponse.data).toEqual(mockChatInfo);
    });
  });
});
