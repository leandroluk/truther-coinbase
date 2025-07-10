import {Module, Provider} from '@nestjs/common';
import {CryptoModule} from '@repo/nest-crypto';
import {DatabaseModule} from '@repo/nest-database';
import * as services from './services';
import {UserController} from './user.controller';

@Module({
  imports: [CryptoModule, DatabaseModule],
  providers: Array<Provider>().concat(Object.values(services)),
  controllers: [UserController],
})
export class UserModule {}
