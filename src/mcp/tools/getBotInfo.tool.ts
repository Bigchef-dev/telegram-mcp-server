import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Get Bot Info MCP Tool
 * Retrieves information about the Telegram bot
 */
export class GetBotInfoTool extends BaseTelegramTool<typeof GetBotInfoTool.SCHEMA> {
  // Schema définition statique pour réutilisation
  static readonly SCHEMA = z.object({});

  readonly name = "get_bot_info";
  readonly description = "Get information about the bot";
  readonly parametersSchema = GetBotInfoTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof GetBotInfoTool.SCHEMA>) {
    try {
      const botInfo = await this.telegramClient.getMe();
      return this.formatJsonResponse(botInfo);
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
