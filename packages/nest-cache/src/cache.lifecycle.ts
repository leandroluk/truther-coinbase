import {Injectable, OnModuleInit} from '@nestjs/common';
import {CacheService} from './cache.service';

@Injectable()
export class CacheLifecycle implements OnModuleInit {
  constructor(private readonly cacheService: CacheService) {}

  async onModuleInit(): Promise<void> {
    await this.cacheService.connect();
  }
}
