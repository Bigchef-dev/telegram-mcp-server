import { UnpinAllChatMessagesTool } from '../../mcp/tools/unpinAllChatMessages.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';

describe('UnpinAllChatMessagesTool', () => {
  let mockTelegramClient: jest.Mocked<ITelegramClient>;
  let unpinAllChatMessagesTool: UnpinAllChatMessagesTool;

  beforeEach(() => {
    mockTelegramClient = {
      getMe: jest.fn(),
      sendMessage: jest.fn(),
      getUpdates: jest.fn(),
      forwardMessage: jest.fn(),
      pinChatMessage: jest.fn(),
      unpinChatMessage: jest.fn(),
      unpinAllChatMessages: jest.fn(),
    };
    
    unpinAllChatMessagesTool = new UnpinAllChatMessagesTool(mockTelegramClient);
  });

  describe('tool configuration', () => {
    it('should have correct name and description', () => {
      expect(unpinAllChatMessagesTool.name).toBe('unpin_all_chat_messages');
      expect(unpinAllChatMessagesTool.description).toBe('Clear the list of pinned messages in a chat. Returns True on success.');
    });

    it('should have correct parameter schema', () => {
      const shape = unpinAllChatMessagesTool.getParameterShape();
      
      expect(shape).toHaveProperty('chatId');
      // Should only have chatId parameter
      expect(Object.keys(shape)).toEqual(['chatId']);
    });
  });

  describe('execute', () => {
    it('should unpin all messages with numeric chatId successfully', async () => {
      const params = {
        chatId: 123456789,
      };

      mockTelegramClient.unpinAllChatMessages.mockResolvedValueOnce(true);

      const result = await unpinAllChatMessagesTool.execute(params);

      expect(mockTelegramClient.unpinAllChatMessages).toHaveBeenCalledWith(
        params.chatId
      );
      
      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
      expect(responseData.chatId).toBe(params.chatId);
      expect(responseData.action).toBe("unpinned all messages");
    });

    it('should unpin all messages with channel username successfully', async () => {
      const params = {
        chatId: '@testchannel',
      };

      mockTelegramClient.unpinAllChatMessages.mockResolvedValueOnce(true);

      const result = await unpinAllChatMessagesTool.execute(params);

      expect(mockTelegramClient.unpinAllChatMessages).toHaveBeenCalledWith(
        params.chatId
      );
      
      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
      expect(responseData.chatId).toBe(params.chatId);
    });

    it('should handle errors gracefully', async () => {
      const params = {
        chatId: 123456789,
      };

      const error = new Error('Permission denied');
      mockTelegramClient.unpinAllChatMessages.mockRejectedValueOnce(error);

      const result = await unpinAllChatMessagesTool.execute(params);

      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.error).toBe('Permission denied');
      expect(responseData.timestamp).toBeDefined();
    });
  });
});
