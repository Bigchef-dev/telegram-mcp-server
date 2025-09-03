import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Forward Message MCP Tool
 * Forwards messages of any kind between chats
 */
export class ForwardMessageTool extends BaseTelegramTool<typeof ForwardMessageTool.SCHEMA> {
  // Schema définition statique pour réutilisation
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
    fromChatId: z.union([z.string(), z.number()]).describe("Unique identifier for the chat where the original message was sent"),
    messageId: z.number().describe("Message identifier in the chat specified in from_chat_id"),
    params: z.object({
      message_thread_id: z.number().optional().describe("Unique identifier for the target message thread (topic) of the forum"),
      video_start_timestamp: z.number().optional().describe("New start timestamp for the forwarded video in the message"),
      disable_notification: z.boolean().optional().describe("Sends the message silently"),
      protect_content: z.boolean().optional().describe("Protects the contents of the forwarded message from forwarding and saving")
    }).optional()
  });

  readonly name = "forward_message";
  readonly description = "Forward messages of any kind";
  readonly parametersSchema = ForwardMessageTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof ForwardMessageTool.SCHEMA>) {
    try {
      const result = await this.telegramClient.forwardMessage(
        params.chatId,
        params.fromChatId,
        params.messageId,
        params.params
      );
      return this.formatJsonResponse(result);
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
