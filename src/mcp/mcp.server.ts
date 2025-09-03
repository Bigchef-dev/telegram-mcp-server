import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ITelegramClient } from "../domain/ports/index.js";
import { MCPToolsRegistry } from "./tool.registry.js";

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
    const toolRegistry = new MCPToolsRegistry(this.telegramClient);
    const server = new McpServer({
      name: "telegram-mcp-server",
      version: "1.0.0"
    }, {});

    toolRegistry.registerWithServer(server);

    return server;
  }
}
