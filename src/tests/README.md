# Tests Structure

This directory contains all tests organized by type and functionality.

## Structure

```
tests/
├── unit/                           # Unit tests with mocks
│   ├── telegram.service.constructor.test.ts    # Service constructor tests
│   ├── telegram.service.bot.test.ts           # Bot info tests
│   ├── telegram.service.messages.test.ts      # Message handling tests
│   ├── mcp.tools.pinChatMessage.test.ts       # Pin message tool tests
│   └── index.ts                               # Unit tests entry point
├── integration/                    # Integration tests with real API
│   ├── telegram.service.integration.test.ts   # Service integration tests
│   └── index.ts                               # Integration tests entry point
├── setup/                         # Test configuration and utilities
│   └── test.setup.ts              # Mock setup and utilities
├── __mocks__/                     # Mock data and implementations
│   └── telegramApi.ts             # Telegram API mock responses
└── index.ts                       # Main tests entry point
```

## Running Tests

### All tests
```bash
npm test
```

### Unit tests only
```bash
npm test -- --testPathPattern=unit
```

### Integration tests only
```bash
npm test -- --testPathPattern=integration
```

### Specific test file
```bash
npm test -- telegram.service.messages
```

## Test Categories

### Unit Tests
- Test individual components in isolation
- Use mocks for external dependencies
- Fast execution
- No external API calls

### Integration Tests
- Test full workflows with real API
- Require environment variables:
  - `TELEGRAM_BOT_TOKEN`: Your bot token
  - `TEST_CHAT_ID`: Chat ID for testing messages
- Slower execution
- Make real API calls

## Adding New Tests

1. **Unit tests**: Add to appropriate file in `unit/` directory
2. **Integration tests**: Add to `integration/telegram.service.integration.test.ts`
3. **New tools**: Create `unit/mcp.tools.[toolName].test.ts`
4. **New services**: Create `unit/[service].test.ts`
