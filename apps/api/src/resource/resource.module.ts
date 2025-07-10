import {Module} from '@nestjs/common';
import {AuthModule} from './auth';
import {CoinModule} from './coin/coin.module';
import {SystemModule} from './system';
import {UserModule} from './user';

@Module({
  imports: [AuthModule, CoinModule, SystemModule, UserModule],
})
export class ResourceModule {}
