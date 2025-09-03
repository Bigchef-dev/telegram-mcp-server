import { z } from "zod";
import { ITelegramClient } from "../../domain/ports/index.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Base interface for MCP tools with generic type safety
 * Defines the contract for all Telegram MCP tools
 */
export interface IMCPTool<TSchema extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>> {
  /**
   * Tool name identifier
   */
  readonly name: string;
  
  /**
   * Tool description for MCP clients
   */
  readonly description: string;
  
  /**
   * Zod schema for tool parameters validation
   */
  readonly parametersSchema: TSchema;
  
  /**
   * Execute the tool with validated parameters
   * @param params Validated parameters matching the schema
   * @returns Tool execution result
   */
  execute(params: z.infer<TSchema>): Promise<CallToolResult>
}

/**
 * Base abstract class for Telegram MCP tools with type safety
 * Provides common functionality and eliminates type duplication
 * 
 * @template TSchema - Must be a ZodObject to access .shape property
 */
export abstract class BaseTelegramTool<TSchema extends z.ZodObject<z.ZodRawShape>> 
  implements IMCPTool<TSchema> {
  
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly parametersSchema: TSchema;

  constructor(protected readonly telegramClient: ITelegramClient) {}

  /**
   * Execute the tool with validated parameters
   * Must be implemented by each concrete tool
   */
  abstract execute(params: z.infer<TSchema>): Promise<CallToolResult>

  /**
   * Get parameter shape for MCP server registration
   * The MCP SDK expects the shape object, not the z.object itself
   * This ensures single source of truth for parameter validation
   */
  getParameterShape(): z.ZodRawShape {
    return this.parametersSchema.shape;
  }


  /**
   * Helper method to format JSON responses consistently
   */
  protected formatJsonResponse(data: any): CallToolResult {
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }

  /**
   * Helper method to format error responses
   */
  protected formatErrorResponse(error: Error): CallToolResult {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          error: error.message,
          timestamp: new Date().toISOString()
        }, null, 2) 
      }]
    };
  }
}
