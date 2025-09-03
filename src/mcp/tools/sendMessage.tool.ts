import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../ports.js";

/**
 * Send Message MCP Tool
 * Sends a text message to a specified chat
 */
export class SendMessageTool extends BaseTelegramTool<typeof SendMessageTool.SCHEMA> {
  // Schema définition statique pour réutilisation
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat"),
    text: z.string().describe("Text of the message to be sent"),
    params: z.record(z.any()).optional().describe("Additional parameters for the message")
  });

  readonly name = "send_message";
  readonly description = "Send a message to a chat";
  readonly parametersSchema = SendMessageTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof SendMessageTool.SCHEMA>) {
    try {
      const result = await this.telegramClient.sendMessage(
        params.chatId,
        params.text,
        params.params
      );
      return this.formatJsonResponse(result);
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
