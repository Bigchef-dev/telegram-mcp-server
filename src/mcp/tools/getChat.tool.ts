import { z } from 'zod';
import { BaseTelegramTool } from './base.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * GetChat MCP Tool
 * Get up-to-date information about the chat
 */
export class GetChatTool extends BaseTelegramTool<typeof GetChatTool.schema> {
  static readonly schema = z.object({
    chat_id: z.union([z.number(), z.string()]).describe('Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)')
  });

  readonly name = 'getChat';
  readonly description = 'Get up-to-date information about the chat. Returns detailed chat information including settings, permissions, and metadata.';
  readonly parametersSchema = GetChatTool.schema;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof GetChatTool.schema>): Promise<CallToolResult> {
    try {
      const result = await this.telegramClient.getChat(params.chat_id);
      
      return this.formatJsonResponse({
        success: true,
        data: result
      });
    } catch (error) {
      return this.formatErrorResponse(
        error instanceof Error ? error : new Error('Unknown error occurred')
      );
    }
  }
}
