import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TGService } from "./telegram.client.js";
import { loadConfig } from "./shared/config/index.js";
import { MCPServerFactory } from "./mcp/mcp.server.js";
import { MCPWebServer } from "./http-server.js";

/**
 * Main entry point for the Telegram MCP Server
 * Supports both stdio and web (HTTP/SSE) modes
 */
async function main(): Promise<void> {
  try {
    // Load configuration
    const config = loadConfig();
    const port = parseInt(process.env.PORT || '3001', 10);
    const mode = process.env.MCP_MODE || 'stdio'; // Changed to use env var and default to stdio

    // Initialize the Telegram service
    const telegramService = new TGService(config.telegram.token);
    
    if (mode === 'stdio') {
      // Stdio Mode (default) for direct MCP client communication
      const serverFactory = new MCPServerFactory(telegramService);
      const server = serverFactory.createServer();
      const transport = new StdioServerTransport();
      
      await server.connect(transport);
      console.error("Telegram MCP Server (stdio mode) started successfully");
    } else {
      // Web Mode (HTTP/SSE) for containers and web integration
      const webServer = new MCPWebServer({
        port,
        telegramService
      });
      
      await webServer.start();
    }

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
