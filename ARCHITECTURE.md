# Architecture Documentation

This document describes the architecture of the `telegram-mcp-server` project following Domain-Driven Design (DDD) and Hexagonal Architecture principles.

## Project Structure

```
src/
├── application/             # Use cases and orchestration
│   └── ProcessUpdateUseCase.ts
├── domain/                  # Business contracts
│   └── ports.ts            # ITelegramClient interface
├── infrastructure/          # External adapters
│   └── telegram.client.ts  # Telegram API implementation
├── mcp/                     # MCP layer - One tool per file
│   ├── server.factory.ts   # MCP server configuration
│   └── tools/              # MCP tools with inheritance
│       ├── base.tool.ts              # Base class for all tools
│       ├── getBotInfo.tool.ts        # Get bot information
│       ├── sendMessage.tool.ts       # Send message
│       ├── getUpdates.tool.ts        # Get updates
│       ├── forwardMessage.tool.ts    # Forward message
│       └── index.ts                 # Tool exports
├── types/telegram/         # Telegram type definitions
├── shared/config/          # Configuration management
├── tests/                  # Test suite
├── app.ts                  # Dependency injection
└── index.ts               # Entry point
```

## Architecture Principles

### Hexagonal Architecture
- **Domain**: Pure business logic and interfaces (`ports.ts`)
- **Application**: Use cases orchestration (`ProcessUpdateUseCase`)
- **Infrastructure**: External adapters (`telegram.client.ts`, MCP tools)

### Dependency Flow
```
MCP Client → index.ts → server.factory.ts → tools/*.tool.ts → ports.ts → telegram.client.ts → Telegram API
```

## Key Components

### MCP Tools (`mcp/tools/`)
Each tool extends `BaseTelegramTool` with:
- **Static Schema**: Single source of truth for parameters
- **Type Safety**: Automatic type inference with `z.infer<typeof Tool.SCHEMA>`
- **No Duplication**: Schema defines both validation and TypeScript types

```typescript
export class SendMessageTool extends BaseTelegramTool {
  static readonly SCHEMA = z.object({
    chatId: z.union([z.string(), z.number()]),
    text: z.string()
  });
  
  readonly parametersSchema = SendMessageTool.SCHEMA;
  
  async execute(params: z.infer<typeof SendMessageTool.SCHEMA>) {
    // params is fully typed: { chatId: string | number; text: string }
    return this.formatJsonResponse(
      await this.telegramClient.sendMessage(params.chatId, params.text)
    );
  }
}
```

### Domain Ports (`domain/ports.ts`)
```typescript
export interface ITelegramClient {
  getMe(): Promise<TelegramUser>;
  sendMessage(chatId: number | string, text: string): Promise<Message>;
  getUpdates(params?: GetUpdatesParams): Promise<TelegramUpdate[]>;
  forwardMessage(chatId: number | string, fromChatId: number | string, messageId: number): Promise<Message>;
}
```

### Server Factory (`mcp/server.factory.ts`)
- Creates MCP server with tool capabilities
- Registers all tools with proper schemas
- Uses `.getParameterShape()` for SDK compatibility

## Design Patterns

1. **Ports & Adapters**: Clean separation between domain and infrastructure
2. **Factory Pattern**: Centralized server creation and tool registration
3. **Template Method**: Base class provides shared functionality
4. **Generic Types**: Type-safe tools with no parameter duplication

## Adding New Tools

1. Create `newTool.tool.ts` extending `BaseTelegramTool`
2. Define `static readonly SCHEMA` 
3. Implement `execute` method (auto-typed from schema)
4. Add to exports and server factory

## Testing

- Unit tests with mocks (`service.test.ts`)
- Integration tests with real API (`service.integration.test.ts`)
- Mock utilities in `__mocks__/`