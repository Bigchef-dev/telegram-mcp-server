import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { MCPServerFactory } from "./mcp/mcp.server.js";
import { TGService } from "./telegram.client.js";

export interface WebServerConfig {
  port: number;
  host?: string;
  telegramService: TGService;
}

/**
 * Web server implementation for MCP over HTTP/SSE
 * Provides REST API endpoints and SSE streaming capabilities
 */
export class MCPWebServer {
  private app: express.Application;
  private serverFactory: MCPServerFactory;
  private config: WebServerConfig;

  constructor(config: WebServerConfig) {
    this.config = config;
    this.app = express();
    this.serverFactory = new MCPServerFactory(config.telegramService);
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    
    // CORS for development
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Mcp-Session-Id');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  private setupRoutes(): void {
    // Root endpoint with API information
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Telegram MCP Server',
        description: 'Model Context Protocol server for Telegram Bot API',
        mode: 'web',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          sse: '/sse (GET)',
          mcp: '/mcp (POST)',
          info: '/ (GET)'
        },
        capabilities: [
          'tools',
          'resources',
          'real-time streaming'
        ]
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'telegram-mcp-server',
        mode: 'web',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // SSE endpoint for server-to-client streaming
    this.app.get('/sse', async (req, res) => {
      try {
        console.log('New SSE connection established');
        
        const server = this.serverFactory.createServer();
        const transport = new SSEServerTransport('/mcp', res);
        
        await server.connect(transport);
        
        // Handle connection cleanup
        req.on('close', () => {
          console.log('SSE connection closed');
        });
        
      } catch (error) {
        console.error('SSE connection error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to establish SSE connection',
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    });

    // MCP endpoint for client-to-server requests
    this.app.post('/mcp', async (req, res) => {
      try {
        console.log('Received MCP request:', req.body?.method || 'unknown');
        
        // For now, return server capabilities and status
        // TODO: Implement proper MCP JSON-RPC handling
        res.json({
          jsonrpc: '2.0',
          result: {
            message: 'MCP Server is running',
            mode: 'web',
            capabilities: {
              tools: ['get_bot_info', 'send_message', 'get_updates', 'forward_message', 
                     'pin_chat_message', 'unpin_chat_message', 'unpin_all_chat_messages', 
                     'getChat', 'sendPoll'],
              resources: ['telegram_api'],
              streaming: true
            },
            server: {
              name: 'telegram-mcp-server',
              version: '1.0.0'
            }
          },
          id: req.body?.id || null
        });
        
      } catch (error) {
        console.error('MCP request error:', error);
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: error instanceof Error ? error.message : 'Internal server error'
          },
          id: req.body?.id || null
        });
      }
    });

    // Ping endpoint for connectivity testing
    this.app.get('/ping', (req, res) => {
      res.json({ 
        message: 'pong',
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Start the web server
   */
  public async start(): Promise<void> {
    const { port, host = '0.0.0.0' } = this.config;
    
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(port, host, () => {
          console.error(`Telegram MCP Server (web mode) started on ${host}:${port}`);
          console.error(`Health check: http://localhost:${port}/health`);
          console.error(`MCP endpoint: http://localhost:${port}/mcp`);
          console.error(`SSE endpoint: http://localhost:${port}/sse`);
          console.error(`API info: http://localhost:${port}/`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the Express app instance (for testing)
   */
  public getApp(): express.Application {
    return this.app;
  }
}
