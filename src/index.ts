import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TGService } from "./telegram.client.js";
import { loadConfig } from "./shared/config/index.js";
import { MCPServerFactory } from "./mcp/mcp.server.js";

/**
 * Main entry point for the Telegram MCP Server
 * Uses the original working approach with cleaner factory pattern
 */
async function main(): Promise<void> {
  try {
    // Load configuration
    const config = loadConfig();

    // Initialize the Telegram service
    const telegramService = new TGService(config.telegram.token);

    // Create MCP server using factory
    const serverFactory = new MCPServerFactory(telegramService);
    const server = serverFactory.createServer();

    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Telegram MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start Telegram MCP Server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
