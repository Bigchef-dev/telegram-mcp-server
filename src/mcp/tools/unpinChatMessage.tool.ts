import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Unpin Chat Message MCP Tool
 * Removes a message from the list of pinned messages in a chat
 */
export class UnpinChatMessageTool extends BaseTelegramTool<typeof UnpinChatMessageTool.SCHEMA> {
  // Schema definition statique pour réutilisation
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
    messageId: z.number().optional().describe("Identifier of the message to unpin. If not specified, the most recent pinned message will be unpinned"),
    businessConnectionId: z.string().optional().describe("Unique identifier of the business connection on behalf of which the message will be unpinned")
  });

  readonly name = "unpin_chat_message";
  readonly description = "Unpin a message in a chat. If no message ID is specified, unpins the most recent pinned message. Returns True on success.";
  readonly parametersSchema = UnpinChatMessageTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof UnpinChatMessageTool.SCHEMA>) {
    try {
      const unpinParams: Record<string, any> = {};
      
      if (params.businessConnectionId !== undefined) {
        unpinParams.business_connection_id = params.businessConnectionId;
      }

      const result = await this.telegramClient.unpinChatMessage(
        params.chatId,
        params.messageId,
        unpinParams
      );
      
      return this.formatJsonResponse({
        success: result,
        chatId: params.chatId,
        messageId: params.messageId || "most recent pinned message",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
