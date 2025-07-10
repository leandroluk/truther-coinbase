import {Module, Provider} from '@nestjs/common';
import {DatabaseModule} from '@repo/nest-database';
import {CoinController} from './coin.controller';
import * as services from './services';

@Module({
  imports: [DatabaseModule],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [CoinController],
})
export class CoinModule {}
