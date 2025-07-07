import {Module, type Provider} from '@nestjs/common';
import {CryptoEnv} from './crypto.env';
import {CryptoService} from './crypto.service';

const providers = Array<Provider>().concat(CryptoEnv, CryptoService);

@Module({
  providers,
  exports: providers,
})
export class CryptoModule {}
