import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Get Updates MCP Tool
 * Retrieves pending updates from the Telegram bot
 */
export class GetUpdatesTool extends BaseTelegramTool<typeof GetUpdatesTool.SCHEMA> {
  // Schema définition statique pour réutilisation
  static readonly SCHEMA = z.object({
    params: z.object({
      offset: z.number().optional().describe("Identifier of the first update to be returned"),
      limit: z.number().min(1).max(100).optional().describe("Limits the number of updates to be retrieved (1-100)"),
      timeout: z.number().optional().describe("Timeout in seconds for long polling"),
      allowed_updates: z.array(z.string()).optional().describe("Array of update types to receive")
    }).optional().describe("Optional parameters for the getUpdates method")
  });

  readonly name = "get_updates";
  readonly description = "Get updates from the bot";
  readonly parametersSchema = GetUpdatesTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof GetUpdatesTool.SCHEMA>) {
    try {
      const updates = await this.telegramClient.getUpdates(params?.params);
      return this.formatJsonResponse(updates);
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
