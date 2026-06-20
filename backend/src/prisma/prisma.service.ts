import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@bsmk/db';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly IDLE_TIMEOUT_MS = 55_000;

  async onModuleInit() {
    await this.retryConnect();
    this.startIdleKeepAlive();
  }

  async onModuleDestroy() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    await this.$disconnect();
  }

  private async retryConnect(attempt = 1): Promise<void> {
    try {
      await this.$connect();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        this.logger.warn(`Database connection failed (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
        return this.retryConnect(attempt + 1);
      }
      this.logger.error('Database connection failed after all retries');
      throw err;
    }
  }

  private startIdleKeepAlive() {
    this.idleTimer = setTimeout(async () => {
      try {
        await this.$queryRaw`SELECT 1`;
      } catch {
        this.logger.warn('Keep-alive ping failed, reconnecting...');
        try {
          await this.$disconnect();
          await this.$connect();
        } catch {
          this.logger.error('Reconnection failed');
        }
      }
      this.startIdleKeepAlive();
    }, this.IDLE_TIMEOUT_MS);
  }

  async executeWithRetry<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
    try {
      return await fn();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'P1001' && attempt < MAX_RETRIES) {
        this.logger.warn(`Query failed (attempt ${attempt}/${MAX_RETRIES}), retrying...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt));
        return this.executeWithRetry(fn, attempt + 1);
      }
      throw err;
    }
  }
}
