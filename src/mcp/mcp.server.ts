import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ITelegramClient } from "../ports.js";

/**
 * MCP Server Factory
 * Creates and configures the MCP server with all Telegram tools
 */
export class MCPServerFactory {
  constructor(private readonly telegramClient: ITelegramClient) {}

  /**
   * Create a fully configured MCP server with all tools
   */
  createServer(): McpServer {
    const server = new McpServer({
      name: "telegram-mcp-server",
      version: "1.0.0"
    }, {
      capabilities: {
        //tools: this.getToolCapabilities(),
        //resources: {}
      }
    });

    this.registerToolHandlers(server);
    
    return server;
  }

  /**
   * Get tool capabilities for server configuration
   */
  private getToolCapabilities() {
    return {
      get_bot_info: {
        description: "Get information about the bot",
        parameters: z.object({})
      },
      send_message: {
        description: "Send a message to a chat",
        parameters: z.object({
          chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat"),
          text: z.string().describe("Text of the message to be sent"),
          params: z.record(z.any()).optional().describe("Additional parameters for the message")
        })
      },
      get_updates: {
        description: "Get updates from the bot",
        parameters: z.object({
          params: z.object({
            offset: z.number().optional().describe("Identifier of the first update to be returned"),
            limit: z.number().min(1).max(100).optional().describe("Limits the number of updates to be retrieved (1-100)"),
            timeout: z.number().optional().describe("Timeout in seconds for long polling"),
            allowed_updates: z.array(z.string()).optional().describe("Array of update types to receive")
          }).optional().describe("Optional parameters for the getUpdates method")
        })
      },
      forward_message: {
        description: "Forward messages of any kind",
        parameters: z.object({
          chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
          fromChatId: z.union([z.string(), z.number()]).describe("Unique identifier for the chat where the original message was sent"),
          messageId: z.number().describe("Message identifier in the chat specified in from_chat_id"),
          params: z.object({
            message_thread_id: z.number().optional().describe("Unique identifier for the target message thread (topic) of the forum"),
            video_start_timestamp: z.number().optional().describe("New start timestamp for the forwarded video in the message"),
            disable_notification: z.boolean().optional().describe("Sends the message silently"),
            protect_content: z.boolean().optional().describe("Protects the contents of the forwarded message from forwarding and saving")
          }).optional()
        })
      }
    };
  }

  /**
   * Register all tool handlers
   */
  private registerToolHandlers(server: McpServer): void {
    // Get Bot Info Tool
    server.tool("get_bot_info", {}, async () => {
      try {
        const botInfo = await this.telegramClient.getMe();
        return {
          content: [{ type: "text", text: JSON.stringify(botInfo, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: (error as Error).message }, null, 2) }]
        };
      }
    });

    // Send Message Tool
    server.tool("send_message", {
      chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat"),
      text: z.string().describe("Text of the message to be sent"),
      params: z.record(z.any()).optional().describe("Additional parameters for the message")
    }, async ({ chatId, text, params }) => {
      try {
        const result = await this.telegramClient.sendMessage(chatId, text, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: (error as Error).message }, null, 2) }]
        };
      }
    });

    // Get Updates Tool
    server.tool("get_updates", {
      params: z.object({
        offset: z.number().optional().describe("Identifier of the first update to be returned"),
        limit: z.number().min(1).max(100).optional().describe("Limits the number of updates to be retrieved (1-100)"),
        timeout: z.number().optional().describe("Timeout in seconds for long polling"),
        allowed_updates: z.array(z.string()).optional().describe("Array of update types to receive")
      }).optional().describe("Optional parameters for the getUpdates method")
    }, async ({ params }) => {
      try {
        const updates = await this.telegramClient.getUpdates(params);
        return {
          content: [{ type: "text", text: JSON.stringify(updates, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: (error as Error).message }, null, 2) }]
        };
      }
    });

    // Forward Message Tool
    server.tool("forward_message", {
      chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
      fromChatId: z.union([z.string(), z.number()]).describe("Unique identifier for the chat where the original message was sent"),
      messageId: z.number().describe("Message identifier in the chat specified in from_chat_id"),
      params: z.object({
        message_thread_id: z.number().optional().describe("Unique identifier for the target message thread (topic) of the forum"),
        video_start_timestamp: z.number().optional().describe("New start timestamp for the forwarded video in the message"),
        disable_notification: z.boolean().optional().describe("Sends the message silently"),
        protect_content: z.boolean().optional().describe("Protects the contents of the forwarded message from forwarding and saving")
      }).optional()
    }, async ({ chatId, fromChatId, messageId, params }) => {
      try {
        const result = await this.telegramClient.forwardMessage(chatId, fromChatId, messageId, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: (error as Error).message }, null, 2) }]
        };
      }
    });
  }
}
