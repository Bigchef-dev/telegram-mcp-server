import { PinChatMessageTool } from '../../mcp/tools/pinChatMessage.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { createMockTelegramClient } from '../__mocks__/telegramClient.js';

describe('PinChatMessageTool', () => {
  let mockTelegramClient: jest.Mocked<ITelegramClient>;
  let pinChatMessageTool: PinChatMessageTool;

  beforeEach(() => {
    mockTelegramClient = createMockTelegramClient();
    pinChatMessageTool = new PinChatMessageTool(mockTelegramClient);
  });

  describe('tool configuration', () => {
    it('should have correct name and description', () => {
      expect(pinChatMessageTool.name).toBe('pin_chat_message');
      expect(pinChatMessageTool.description).toBe('Pin a message in a chat. Returns True on success.');
    });

    it('should have correct parameter schema', () => {
      const shape = pinChatMessageTool.getParameterShape();
      
      expect(shape).toHaveProperty('chatId');
      expect(shape).toHaveProperty('messageId');
      expect(shape).toHaveProperty('businessConnectionId');
      expect(shape).toHaveProperty('disableNotification');
    });
  });

  describe('execute', () => {
    it('should pin message successfully with minimal parameters', async () => {
      const params = {
        chatId: 123456789,
        messageId: 12345,
      };

      mockTelegramClient.pinChatMessage.mockResolvedValueOnce(true);

      const result = await pinChatMessageTool.execute(params);

      expect(mockTelegramClient.pinChatMessage).toHaveBeenCalledWith(
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

    it('should pin message with additional parameters', async () => {
      const params = {
        chatId: '@testchannel',
        messageId: 12345,
        businessConnectionId: 'business123',
        disableNotification: true,
      };

      mockTelegramClient.pinChatMessage.mockResolvedValueOnce(true);

      const result = await pinChatMessageTool.execute(params);

      expect(mockTelegramClient.pinChatMessage).toHaveBeenCalledWith(
        params.chatId,
        params.messageId,
        {
          business_connection_id: params.businessConnectionId,
          disable_notification: params.disableNotification,
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
      mockTelegramClient.pinChatMessage.mockRejectedValueOnce(error);

      const result = await pinChatMessageTool.execute(params);

      expect(result.content[0].type).toBe('text');
      const responseData = JSON.parse(result.content[0].text as string);
      expect(responseData.error).toBe('Permission denied');
      expect(responseData.timestamp).toBeDefined();
    });
  });
});
