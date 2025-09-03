import { z } from 'zod';
import { BaseTelegramTool } from './base.tool.js';
import { ITelegramClient } from '../../domain/ports/index.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * SendPoll MCP Tool
 * Send a native poll to a chat
 */
export class SendPollTool extends BaseTelegramTool<typeof SendPollTool.parametersSchema> {
  readonly name = 'sendPoll';
  readonly description = 'Send a native poll to a chat. A poll must have between 2 and 10 answer options. Returns the sent Message containing the poll on success. Note: Polls can\'t be sent to channel direct messages chats.';

  static readonly parametersSchema = z.object({
    business_connection_id: z.string().optional().describe('Unique identifier of the business connection on behalf of which the message will be sent'),
    chat_id: z.union([z.number(), z.string()]).describe('Unique identifier for the target chat or username of the target channel (in the format @channelusername)'),
    message_thread_id: z.number().optional().describe('Unique identifier for the target message thread (topic) of the forum; for forum supergroups only'),
    question: z.string().min(1).max(300).describe('Poll question, 1-300 characters'),
    question_parse_mode: z.string().optional().describe('Mode for parsing entities in the question. See formatting options for more details. Currently, only custom emoji entities are allowed'),
    question_entities: z.array(z.any()).optional().describe('A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of question_parse_mode'),
    options: z.array(z.object({
      text: z.string().min(1).max(100).describe('Option text, 1-100 characters'),
      text_parse_mode: z.string().optional().describe('Mode for parsing entities in the text'),
      text_entities: z.array(z.any()).optional().describe('List of special entities that appear in the option text')
    })).min(2).max(10).describe('A JSON-serialized list of 2-10 answer options. Each poll must have exactly between 2 and 10 answer options.'),
    is_anonymous: z.boolean().optional().describe('True, if the poll needs to be anonymous, defaults to True'),
    type: z.enum(['quiz', 'regular']).optional().describe('Poll type, "quiz" or "regular", defaults to "regular"'),
    allows_multiple_answers: z.boolean().optional().describe('True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False'),
    correct_option_id: z.number().optional().describe('0-based identifier of the correct answer option, required for polls in quiz mode'),
    explanation: z.string().max(200).optional().describe('Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing'),
    explanation_parse_mode: z.string().optional().describe('Mode for parsing entities in the explanation. See formatting options for more details.'),
    explanation_entities: z.array(z.any()).optional().describe('A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of explanation_parse_mode'),
    open_period: z.number().min(5).max(600).optional().describe('Amount of time in seconds the poll will be active after creation, 5-600. Can\'t be used together with close_date.'),
    close_date: z.number().optional().describe('Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can\'t be used together with open_period.'),
    is_closed: z.boolean().optional().describe('Pass True if the poll needs to be immediately closed. This can be useful for poll preview.'),
    disable_notification: z.boolean().optional().describe('Sends the message silently. Users will receive a notification with no sound.'),
    protect_content: z.boolean().optional().describe('Protects the contents of the sent message from forwarding and saving'),
    allow_paid_broadcast: z.boolean().optional().describe('Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot\'s balance'),
    message_effect_id: z.string().optional().describe('Unique identifier of the message effect to be added to the message; for private chats only'),
    reply_parameters: z.object({
      message_id: z.number(),
      chat_id: z.union([z.number(), z.string()]).optional(),
      allow_sending_without_reply: z.boolean().optional(),
      quote: z.string().optional(),
      quote_parse_mode: z.string().optional(),
      quote_entities: z.array(z.any()).optional(),
      quote_position: z.number().optional()
    }).optional().describe('Description of the message to reply to'),
    reply_markup: z.any().optional().describe('Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user')
  });

  readonly parametersSchema = SendPollTool.parametersSchema;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof SendPollTool.parametersSchema>): Promise<CallToolResult> {
    try {
      const result = await this.telegramClient.sendPoll(params);
      
      return this.formatJsonResponse({
        success: true,
        message: result,
        info: `Poll "${params.question}" sent successfully to chat ${params.chat_id}`
      });
    } catch (error) {
      return this.formatErrorResponse(
        error instanceof Error ? error : new Error('Unknown error occurred')
      );
    }
  }
}
