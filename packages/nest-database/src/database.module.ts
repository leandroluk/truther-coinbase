import {Module, type Provider} from '@nestjs/common';
import {LoggerModule} from '@repo/nest-logger';
import {DatabaseEnv} from './database.env';
import {DatabaseLifecycle} from './database.lifecycle';
import {DatabaseService} from './database.service';

const providers = Array<Provider>().concat(DatabaseEnv, DatabaseService, DatabaseLifecycle);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class DatabaseModule {}
