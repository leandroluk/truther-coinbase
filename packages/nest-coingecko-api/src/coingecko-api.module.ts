import {Module, Provider} from '@nestjs/common';
import {LoggerModule} from '@repo/nest-logger';
import {CoingeckoApiEnv} from './coingecko-api.env';
import {CoingeckoApiService} from './coingecko-api.service';

const providers = Array<Provider>().concat(
  CoingeckoApiEnv, //
  CoingeckoApiService
);

@Module({
  imports: [LoggerModule],
  providers,
  exports: providers,
})
export class CoingeckoApiModule {}
