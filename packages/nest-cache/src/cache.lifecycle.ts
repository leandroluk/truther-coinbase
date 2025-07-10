import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {CacheService} from './cache.service';

@Injectable()
export class CacheLifecycle implements OnApplicationBootstrap {
  constructor(private readonly cacheService: CacheService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.cacheService.connect();
  }
}
