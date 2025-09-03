import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TGService } from "./infrastructure/telegram.client.js";
import { loadConfig } from "./shared/config/index.js";

// Load configuration
const config = loadConfig();

// Initialize the Telegram service
const telegramService = new TGService(config.telegram.token);

// Create an MCP server
const server = new McpServer({
  name: "telegram-mcp-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {
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
        parameters: z.object({})
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
    }
  }
});

// Define Telegram tools
server.tool("get_bot_info",
  {},
  async () => {
    const botInfo = await telegramService.getMe();
    return {
      content: [{ type: "text", text: JSON.stringify(botInfo, null, 2) }]
    };
  }
);

server.tool("send_message",
  {
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat"),
    text: z.string().describe("Text of the message to be sent"),
    params: z.record(z.any()).optional().describe("Additional parameters for the message")
  },
  async ({ chatId, text, params }) => {
    const result = await telegramService.sendMessage(chatId, text, params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

server.tool("get_updates",
  {
    params: z.object({
      offset: z.number().optional().describe("Identifier of the first update to be returned"),
      limit: z.number().min(1).max(100).optional().describe("Limits the number of updates to be retrieved (1-100)"),
      timeout: z.number().optional().describe("Timeout in seconds for long polling"),
      allowed_updates: z.array(z.string()).optional().describe("Array of update types to receive")
    }).optional().describe("Optional parameters for the getUpdates method")
  },
  async ({ params }) => {
    const updates = await telegramService.getUpdates(params);
    return {
      content: [{ type: "text", text: JSON.stringify(updates, null, 2) }]
    };
  }
);

server.tool("forward_message",
  {
    chatId: z.union([z.string(), z.number()]).describe("Unique identifier for the target chat or username of the target channel"),
    fromChatId: z.union([z.string(), z.number()]).describe("Unique identifier for the chat where the original message was sent"),
    messageId: z.number().describe("Message identifier in the chat specified in from_chat_id"),
    params: z.object({
      message_thread_id: z.number().optional().describe("Unique identifier for the target message thread (topic) of the forum"),
      video_start_timestamp: z.number().optional().describe("New start timestamp for the forwarded video in the message"),
      disable_notification: z.boolean().optional().describe("Sends the message silently"),
      protect_content: z.boolean().optional().describe("Protects the contents of the forwarded message from forwarding and saving")
    }).optional()
  },
  async ({ chatId, fromChatId, messageId, params }) => {
    const result = await telegramService.forwardMessage(chatId, fromChatId, messageId, params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);

