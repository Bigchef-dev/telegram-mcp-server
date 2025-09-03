/**
 * Application Composition Root
 * Wiring together all domain services and dependencies
 */

import { loadConfig } from './shared/config/index.js';
import { TGService } from './telegram.client.js';
import { ProcessUpdateUseCase } from './application/ProcessUpdateUseCase.js';

/**
 * Application bootstrap and dependency injection
 */
export class App {
  private readonly config = loadConfig();
  private readonly telegramClient: TGService;
  private readonly processUpdateUseCase: ProcessUpdateUseCase;

  constructor() {
    // Initialize infrastructure adapters
    this.telegramClient = new TGService(this.config.telegram.token);
    
    // Initialize use cases with dependencies
    this.processUpdateUseCase = new ProcessUpdateUseCase(this.telegramClient);
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    console.log('Starting Telegram MCP Server...');
    
    try {
      // Verify bot token by getting bot info
      const botInfo = await this.processUpdateUseCase.getBotInfo();
      console.log(`Bot authenticated: @${botInfo.username} (${botInfo.first_name})`);
      
      // Start polling for updates
      await this.startPolling();
      
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  /**
   * Simple polling loop for demonstration
   */
  private async startPolling(): Promise<void> {
    let offset = 0;
    
    while (true) {
      try {
        const updates = await this.processUpdateUseCase.fetchUpdates(offset);
        
        if (updates.length > 0) {
          await this.processUpdateUseCase.processUpdates(updates);
          
          // Update offset to acknowledge processed updates
          offset = Math.max(...updates.map(u => u.update_id)) + 1;
        }
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Polling error:', error);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

// Export a factory function for easy testing
export function createApp(): App {
  return new App();
}
