import {Module, Provider} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {CoingeckoApiModule} from '@repo/nest-coingecko-api';
import {DatabaseModule} from '@repo/nest-database';
import {LoggerModule} from '@repo/nest-logger';
import {CoinController} from './coin.controller';
import {CoinEnv} from './coin.env';
import {CoinLifecycle} from './coin.lifecycle';
import * as services from './services';
import * as workers from './workers';

@Module({
  imports: [ScheduleModule.forRoot(), CoingeckoApiModule, LoggerModule, DatabaseModule],
  providers: Array<Provider>().concat(
    CoinEnv, //
    CoinLifecycle,
    Object.values(services),
    Object.values(workers)
  ),
  controllers: [CoinController],
})
export class CoinModule {}
