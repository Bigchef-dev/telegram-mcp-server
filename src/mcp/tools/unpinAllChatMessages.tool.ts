import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Unpin All Chat Messages MCP Tool
 * Clears the list of pinned messages in a chat
 */
export class UnpinAllChatMessagesTool extends BaseTelegramTool<typeof UnpinAllChatMessagesTool.SCHEMA> {
  // Schema definition statique pour réutilisation
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel")
  });

  readonly name = "unpin_all_chat_messages";
  readonly description = "Clear the list of pinned messages in a chat. Returns True on success.";
  readonly parametersSchema = UnpinAllChatMessagesTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof UnpinAllChatMessagesTool.SCHEMA>) {
    try {
      const result = await this.telegramClient.unpinAllChatMessages(params.chatId);
      
      return this.formatJsonResponse({
        success: result,
        chatId: params.chatId,
        action: "unpinned all messages",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
