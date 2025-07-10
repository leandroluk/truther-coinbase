import {Module} from '@nestjs/common';
import {LoggerModule} from '@repo/nest-logger';
import {AppEnv} from './app.env';
import {AuthModule, CoinModule, SystemModule, UserModule} from './resource';

@Module({
  imports: [
    LoggerModule, //

    AuthModule,
    CoinModule,
    SystemModule,
    UserModule,
  ],
  providers: [AppEnv],
})
export class AppModule {}
