import { z } from "zod";
import { BaseTelegramTool } from "./base.tool.js";
import { ITelegramClient } from "../../domain/ports/index.js";

/**
 * Send Contact MCP Tool
 * Sends phone contacts to a specified chat
 */
export class SendContactTool extends BaseTelegramTool<typeof SendContactTool.SCHEMA> {
  // Schema definition for contact parameters
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
    phoneNumber: z.string().describe("Contact's phone number"),
    firstName: z.string().describe("Contact's first name"),
    lastName: z.string().optional().describe("Contact's last name"),
    vcard: z.string().optional().describe("Additional data about the contact in the form of a vCard, 0-2048 bytes"),
    businessConnectionId: z.string().optional().describe("Unique identifier of the business connection on behalf of which the message will be sent"),
    messageThreadId: z.number().optional().describe("Unique identifier for the target message thread (topic) of the forum; for forum supergroups only"),
    directMessagesTopicId: z.number().optional().describe("Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat"),
    disableNotification: z.boolean().optional().describe("Sends the message silently. Users will receive a notification with no sound"),
    protectContent: z.boolean().optional().describe("Protects the contents of the sent message from forwarding and saving"),
    allowPaidBroadcast: z.boolean().optional().describe("Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message"),
    messageEffectId: z.string().optional().describe("Unique identifier of the message effect to be added to the message; for private chats only"),
    replyParameters: z.record(z.any()).optional().describe("Description of the message to reply to"),
    replyMarkup: z.record(z.any()).optional().describe("Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user")
  });

  readonly name = "send_contact";
  readonly description = "Send phone contacts to a chat";
  readonly parametersSchema = SendContactTool.SCHEMA;

  constructor(telegramClient: ITelegramClient) {
    super(telegramClient);
  }

  async execute(params: z.infer<typeof SendContactTool.SCHEMA>) {
    try {
      // Transform parameters to match API expectations
      const apiParams: Record<string, any> = {};
      
      if (params.lastName) apiParams.last_name = params.lastName;
      if (params.vcard) apiParams.vcard = params.vcard;
      if (params.businessConnectionId) apiParams.business_connection_id = params.businessConnectionId;
      if (params.messageThreadId) apiParams.message_thread_id = params.messageThreadId;
      if (params.directMessagesTopicId) apiParams.direct_messages_topic_id = params.directMessagesTopicId;
      if (params.disableNotification) apiParams.disable_notification = params.disableNotification;
      if (params.protectContent) apiParams.protect_content = params.protectContent;
      if (params.allowPaidBroadcast) apiParams.allow_paid_broadcast = params.allowPaidBroadcast;
      if (params.messageEffectId) apiParams.message_effect_id = params.messageEffectId;
      if (params.replyParameters) apiParams.reply_parameters = params.replyParameters;
      if (params.replyMarkup) apiParams.reply_markup = params.replyMarkup;

      const result = await this.telegramClient.sendContact(
        params.chatId,
        params.phoneNumber,
        params.firstName,
        apiParams
      );
      
      return this.formatJsonResponse(result);
    } catch (error) {
      return this.formatErrorResponse(error as Error);
    }
  }
}
