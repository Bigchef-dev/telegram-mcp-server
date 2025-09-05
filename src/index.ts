import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { TGService } from "./telegram.client.js";
import { loadConfig } from "./shared/config/index.js";
import { MCPServerFactory } from "./mcp/mcp.server.js";
import express from "express";

/**
 * Main entry point for the Telegram MCP Server
 * Supports both stdio and HTTP/SSE modes
 */
async function main(): Promise<void> {
  try {
    // Load configuration
    const config = loadConfig();
    const port = parseInt(process.env.PORT || '3001', 10);
    const mode = 'http'

    // Initialize the Telegram service
    const telegramService = new TGService(config.telegram.token);

    // Create MCP server using factory
    const serverFactory = new MCPServerFactory(telegramService);
    
    if (mode === 'http') {
      // HTTP/SSE Mode for Docker containers
      const app = express();
      app.use(express.json());

      // Health check endpoint
      app.get('/health', (req, res) => {
        res.json({ 
          status: 'healthy', 
          service: 'telegram-mcp-server',
          timestamp: new Date().toISOString() 
        });
      });

      // MCP endpoint with SSE transport
      app.post('/mcp', async (req, res) => {
        try {
          const server = serverFactory.createServer();
          const transport = new SSEServerTransport('/mcp', res);
          await server.connect(transport);
          
          // Handle the incoming JSON-RPC request
          await transport.handleMessage(req.body);
        } catch (error) {
          console.error('MCP request error:', error);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      });

      // Root endpoint with API info
      app.get('/', (req, res) => {
        res.json({
          name: 'Telegram MCP Server',
          description: 'Model Context Protocol server for Telegram Bot API',
          endpoints: {
            health: '/health',
            mcp: '/mcp (POST)'
          }
        });
      });

      // Start HTTP server
      app.listen(port, '0.0.0.0', () => {
        console.error(`Telegram MCP Server (HTTP mode) started on port ${port}`);
        console.error(`Health check: http://localhost:${port}/health`);
        console.error(`MCP endpoint: http://localhost:${port}/mcp`);
      });

    } else {
      // Stdio Mode (default)
      const server = serverFactory.createServer();
      const transport = new StdioServerTransport();
      await server.connect(transport);
      console.error("Telegram MCP Server (stdio mode) started successfully");
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
