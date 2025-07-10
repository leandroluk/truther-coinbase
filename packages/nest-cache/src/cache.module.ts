import {Module, type Provider} from '@nestjs/common';
import {LoggerModule} from '@repo/nest-logger';
import {CacheEnv} from './cache.env';
import {CacheLifecycle} from './cache.lifecycle';
import {CacheService} from './cache.service';

const providers = Array<Provider>().concat(
  CacheEnv, //
  CacheLifecycle,
  CacheService
);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class CacheModule {}
