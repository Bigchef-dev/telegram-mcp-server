import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ITelegramClient } from "../domain/ports/index.js";
import {
  IMCPTool,
  GetBotInfoTool,
  SendMessageTool,
  GetUpdatesTool,
  ForwardMessageTool,
  PinChatMessageTool,
  UnpinChatMessageTool,
  UnpinAllChatMessagesTool
} from "./tools/index.js";

/**
 * MCP Tools Registry
 * Manages registration and lifecycle of MCP tools
 */
export class MCPToolsRegistry {
  private readonly tools: Map<string, IMCPTool> = new Map();

  constructor(private readonly telegramClient: ITelegramClient) {
    this.initializeTools();
  }

  /**
   * Initialize and register all available tools
   */
  private initializeTools(): void {
    const tools: IMCPTool[] = [
      new GetBotInfoTool(this.telegramClient),
      new SendMessageTool(this.telegramClient),
      new GetUpdatesTool(this.telegramClient),
      new ForwardMessageTool(this.telegramClient),
      new PinChatMessageTool(this.telegramClient),
      new UnpinChatMessageTool(this.telegramClient),
      new UnpinAllChatMessagesTool(this.telegramClient)
    ];

    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  /**
   * Register all tools with the MCP server
   */
  registerWithServer(server: McpServer): void {
    for (const tool of this.tools.values()) {
      // Register tool handler - MCP SDK expects parameters in args
      server.tool(tool.name, tool.description, tool.parametersSchema.shape, tool.execute.bind(tool));
    }
  }

  /**
   * Get a specific tool by name
   */
  getTool(name: string): IMCPTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): IMCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tool names for capability declaration
   */
  getToolCapabilities(): Record<string, { description: string; parameters: any }> {
    const capabilities: Record<string, { description: string; parameters: any }> = {};
    
    for (const tool of this.tools.values()) {
      capabilities[tool.name] = {
        description: tool.description,
        parameters: tool.parametersSchema
      };
    }
    
    return capabilities;
  }
}
