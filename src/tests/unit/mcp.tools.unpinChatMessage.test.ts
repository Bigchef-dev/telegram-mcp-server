import { UnpinChatMessageTool } from '../../mcp/tools/unpinChatMessage.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { createMockTelegramClient } from '../__mocks__/telegramClient.js';

describe('UnpinChatMessageTool', () => {
  let mockTelegramClient: jest.Mocked<ITelegramClient>;
  let unpinChatMessageTool: UnpinChatMessageTool;

  beforeEach(() => {
    mockTelegramClient = createMockTelegramClient();
    unpinChatMessageTool = new UnpinChatMessageTool(mockTelegramClient);
  });

  describe('tool configuration', () => {
    it('should have correct name and description', () => {
      expect(unpinChatMessageTool.name).toBe('unpin_chat_message');
      expect(unpinChatMessageTool.description).toBe('Unpin a message in a chat. If no message ID is specified, unpins the most recent pinned message. Returns True on success.');
    });

    it('should have correct parameter schema', () => {
      const shape = unpinChatMessageTool.getParameterShape();
      
      expect(shape).toHaveProperty('chatId');
      expect(shape).toHaveProperty('messageId');
      expect(shape).toHaveProperty('businessConnectionId');
    });
  });

  describe('execute', () => {
    it('should unpin specific message successfully', async () => {
      const params = {
        chatId: 123456789,
        messageId: 12345,
      };

      mockTelegramClient.unpinChatMessage.mockResolvedValueOnce(true);

      const result = await unpinChatMessageTool.execute(params);

      expect(mockTelegramClient.unpinChatMessage).toHaveBeenCalledWith(
        params.chatId,
        params.messageId,
        {}
      );
      
      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
      expect(responseData.chatId).toBe(params.chatId);
      expect(responseData.messageId).toBe(params.messageId);
    });

    it('should unpin most recent message when no messageId provided', async () => {
      const params = {
        chatId: '@testchannel',
      };

      mockTelegramClient.unpinChatMessage.mockResolvedValueOnce(true);

      const result = await unpinChatMessageTool.execute(params);

      expect(mockTelegramClient.unpinChatMessage).toHaveBeenCalledWith(
        params.chatId,
        undefined,
        {}
      );
      
      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
      expect(responseData.messageId).toBe("most recent pinned message");
    });

    it('should unpin message with business connection', async () => {
      const params = {
        chatId: 123456789,
        messageId: 12345,
        businessConnectionId: 'business123',
      };

      mockTelegramClient.unpinChatMessage.mockResolvedValueOnce(true);

      const result = await unpinChatMessageTool.execute(params);

      expect(mockTelegramClient.unpinChatMessage).toHaveBeenCalledWith(
        params.chatId,
        params.messageId,
        {
          business_connection_id: params.businessConnectionId,
        }
      );
      
      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.success).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const params = {
        chatId: 123456789,
        messageId: 12345,
      };

      const error = new Error('Permission denied');
      mockTelegramClient.unpinChatMessage.mockRejectedValueOnce(error);

      const result = await unpinChatMessageTool.execute(params);

      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.error).toBe('Permission denied');
      expect(responseData.timestamp).toBeDefined();
    });
  });
});
