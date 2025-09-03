import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Pin Chat Message MCP Tool
 * Adds a message to the list of pinned messages in a chat
 */
export class PinChatMessageTool extends BaseTelegramTool<typeof PinChatMessageTool.SCHEMA> {
  // Schema definition statique pour réutilisation
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
    messageId: z.number().describe("Identifier of a message to pin"),
    businessConnectionId: z.string().optional().describe("Unique identifier of the business connection on behalf of which the message will be pinned"),
    disableNotification: z.boolean().optional().describe("Pass True if it is not necessary to send a notification to all chat members about the new pinned message")
  });

  readonly name = "pin_chat_message";
  readonly description = "Pin a message in a chat. Returns True on success.";
  readonly parametersSchema = PinChatMessageTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof PinChatMessageTool.SCHEMA>) {
    try {
      const pinParams: Record<string, any> = {};
      
      if (params.businessConnectionId !== undefined) {
        pinParams.business_connection_id = params.businessConnectionId;
      }
      
      if (params.disableNotification !== undefined) {
        pinParams.disable_notification = params.disableNotification;
      }

      const result = await this.telegramClient.pinChatMessage(
        params.chatId,
        params.messageId,
        pinParams
      );
      
      return this.formatJsonResponse({
        success: result,
        chatId: params.chatId,
        messageId: params.messageId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
