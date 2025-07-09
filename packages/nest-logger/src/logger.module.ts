import {Module, type Provider} from '@nestjs/common';
import {LoggerService} from './logger.service';

const providers = Array<Provider>().concat(LoggerService);

@Module({
  providers,
  exports: providers,
})
export class LoggerModule {}
