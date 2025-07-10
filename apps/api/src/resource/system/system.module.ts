import {Module, Provider} from '@nestjs/common';
import {CacheModule} from '@repo/nest-cache';
import {DatabaseModule} from '@repo/nest-database';
import * as services from './services';
import {SystemController} from './system.controller';

@Module({
  imports: [CacheModule, DatabaseModule],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [SystemController],
})
export class SystemModule {}
