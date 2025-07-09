import {Injectable} from '@nestjs/common';
import {LoggerService} from '@repo/nest-logger';
import Redis from 'ioredis';
import {CacheEnv} from './cache.env';

@Injectable()
export class CacheService {
  private readonly client: Redis;

  constructor(
    private readonly cacheEnv: CacheEnv,
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
      await this.client.ping();
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  async get<T = unknown>(pattern: string): Promise<T | null> {
    try {
      const [key] = await this.client.keys(`${this.cacheEnv.key}:${pattern}`);
      if (key) {
        const stringfiedValue = await this.client.get(key);
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
    const ref = `${this.cacheEnv.key}:${key}`;
    const stringfiedValue = JSON.stringify(value);
    let multi = this.client.multi().set(ref, stringfiedValue);
    if (expiresInSeconds && Number.isFinite(expiresInSeconds)) {
      multi = multi.expire(ref, expiresInSeconds);
    }
    await multi.exec();
  }

  async del(pattern: string): Promise<void> {
    const fullPattern = `${this.cacheEnv.key}:${pattern}`;
    const stream = this.client.scanStream({
      match: fullPattern,
      count: 100,
    });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        try {
          await this.client.del(...keys);
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
    return Boolean(await this.client.exists(key));
  }

  async refresh(key: string, expiresInSeconds: number): Promise<void> {
    await this.client.expire(key, expiresInSeconds);
  }
}
