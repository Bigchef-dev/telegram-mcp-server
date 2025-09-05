import { Message, ForwardMessageParams, PinChatMessageParams, UnpinChatMessageParams, SendPollParams, SendContactParams } from '../../../types/index.js';
import { BaseTelegramService } from '../base/telegram.base.service.js';

/**
 * Telegram Message Service
 * Handles all message-related operations
 */
export class TelegramMessageService extends BaseTelegramService {
  /**
   * Send a message to a chat
   * @param chatId Unique identifier for the target chat
   * @param text Text of the message to be sent
   * @param params Additional parameters for the message
   */
  async sendMessage(
    chatId: number | string,
    text: string,
    params?: Record<string, any>
  ): Promise<Message> {
    return this.request<Message>('sendMessage', {
      chat_id: chatId,
      text,
      ...params,
    });
  }

  /**
   * Use this method to forward messages of any kind.
   * @param chatId Unique identifier for the target chat or username of the target channel
   * @param fromChatId Unique identifier for the chat where the original message was sent
   * @param messageId Message identifier in the chat specified in from_chat_id
   * @param params Additional parameters for the forward message
   */
  async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    params?: ForwardMessageParams
  ): Promise<Message> {
    return this.request<Message>('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...params,
    });
  }

  /**
   * Use this method to edit text and game messages.
   */
  async editMessageText(
    chatId: number | string,
    messageId: number,
    text: string,
    params?: Record<string, any>
  ): Promise<Message> {
    return this.request<Message>('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      ...params,
    });
  }

  /**
   * Use this method to delete a message, including service messages.
   */
  async deleteMessage(
    chatId: number | string,
    messageId: number
  ): Promise<boolean> {
    return this.request<boolean>('deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  /**
   * Use this method to copy messages of any kind.
   */
  async copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    params?: Record<string, any>
  ): Promise<{ message_id: number }> {
    return this.request<{ message_id: number }>('copyMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      ...params,
    });
  }

  /**
   * Use this method to add a message to the list of pinned messages in a chat.
   * @param chatId Unique identifier for the target chat or username of the target channel
   * @param messageId Identifier of a message to pin
   * @param params Additional parameters for pinning the message
   */
  async pinChatMessage(
    chatId: number | string,
    messageId: number,
    params?: Omit<PinChatMessageParams, 'chat_id' | 'message_id'>
  ): Promise<boolean> {
    return this.request<boolean>('pinChatMessage', {
      chat_id: chatId,
      message_id: messageId,
      ...params,
    });
  }

  /**
   * Use this method to remove a message from the list of pinned messages in a chat.
   * @param chatId Unique identifier for the target chat or username of the target channel
   * @param messageId Identifier of the message to unpin (optional - if not specified, unpins the most recent pinned message)
   * @param params Additional parameters for unpinning the message
   */
  async unpinChatMessage(
    chatId: number | string,
    messageId?: number,
    params?: Omit<UnpinChatMessageParams, 'chat_id' | 'message_id'>
  ): Promise<boolean> {
    const requestParams: Record<string, any> = {
      chat_id: chatId,
      ...params,
    };

    if (messageId !== undefined) {
      requestParams.message_id = messageId;
    }

    return this.request<boolean>('unpinChatMessage', requestParams);
  }

  /**
   * Use this method to clear the list of pinned messages in a chat.
   * @param chatId Unique identifier for the target chat or username of the target channel
   */
  async unpinAllChatMessages(
    chatId: number | string
  ): Promise<boolean> {
    return this.request<boolean>('unpinAllChatMessages', {
      chat_id: chatId,
    });
  }

  /**
   * Use this method to send a native poll.
   * @param params Parameters for sending the poll
   */
  async sendPoll(params: SendPollParams): Promise<Message> {
    return this.request<Message>('sendPoll', params);
  }

  /**
   * Use this method to send phone contacts.
   * @param chatId Unique identifier for the target chat
   * @param phoneNumber Contact's phone number
   * @param firstName Contact's first name
   * @param params Additional contact parameters
   */
  async sendContact(
    chatId: number | string,
    phoneNumber: string,
    firstName: string,
    params?: Record<string, any>
  ): Promise<Message> {
    return this.request<Message>('sendContact', {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      ...params,
    });
  }
}
