import {Injectable} from '@nestjs/common';
import {LoggerService} from '@repo/nest-logger';
import Redis from 'ioredis';
import {CacheEnv} from './cache.env';

@Injectable()
export class CacheService {
  private readonly client: Redis;
  private readonly cacheKey = 'cache';

  constructor(
    private readonly cacheEnv: CacheEnv,
    private readonly cacheClient: Redis,
    private readonly loggerService: LoggerService
  ) {
    this.client = new Redis(this.cacheEnv.url, {lazyConnect: true});
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.loggerService.error(`Failed to init ${this.constructor.name}.`, error);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.cacheClient.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  async get<T = unknown>(pattern: string): Promise<T | null> {
    try {
      const [key] = await this.cacheClient.keys(`${this.cacheKey}:${pattern}`);
      if (key) {
        const stringfiedValue = await this.cacheClient.get(key);
        if (stringfiedValue) {
          const value = JSON.parse(stringfiedValue);
          return value;
        }
      }
    } catch {
      //
    }
    return null;
  }

  async set<T = unknown>(key: string, value: T, expiresInSeconds?: number): Promise<void> {
    const ref = `${this.cacheKey}:${key}`;
    const stringfiedValue = JSON.stringify(value);
    let multi = this.cacheClient.multi().set(ref, stringfiedValue);
    if (expiresInSeconds && Number.isFinite(expiresInSeconds)) {
      multi = multi.expire(ref, expiresInSeconds);
    }
    await multi.exec();
  }

  async del(pattern: string): Promise<void> {
    const fullPattern = `${this.cacheKey}:${pattern}`;
    const stream = this.cacheClient.scanStream({
      match: fullPattern,
      count: 100,
    });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        try {
          await this.cacheClient.del(...keys);
          this.loggerService.log(`Deleted ${keys.length} cache keys matching pattern "${fullPattern}"`);
        } catch {
          this.loggerService.warn(`Failed to delete some cache keys matching pattern "${fullPattern}"`);
        }
      }
    });

    return new Promise<void>((resolve, reject) => {
      stream.on('end', () => resolve());
      stream.on('error', error => reject(error));
    });
  }

  async has(key: string): Promise<boolean> {
    return Boolean(await this.cacheClient.exists(key));
  }

  async refresh(key: string, expiresInSeconds: number): Promise<void> {
    await this.cacheClient.expire(key, expiresInSeconds);
  }
}
