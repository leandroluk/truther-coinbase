import {Module, type Provider} from '@nestjs/common';
import {CacheModule} from '@repo/nest-cache';
import * as guards from './guards';
import {SessionEnv} from './session.env';
import {SessionService} from './session.service';

const providers = Array<Provider>().concat(
  SessionEnv, //
  SessionService,
  Object.values(guards)
);

@Module({
  imports: [CacheModule],
  providers,
  exports: providers,
})
export class SessionModule {}
