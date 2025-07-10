import {Module} from '@nestjs/common';
import {LoggerModule} from '@repo/nest-logger';
import {AppEnv} from './app.env';
import {ResourceModule} from './resource';

@Module({
  imports: [LoggerModule, ResourceModule],
  providers: [AppEnv],
})
export class AppModule {}
