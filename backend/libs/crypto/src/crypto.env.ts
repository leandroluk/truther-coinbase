import {EnvProperty} from '@backend-libs/common';
import {Injectable} from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class CryptoEnv {
  @EnvProperty({
    name: 'PACKAGES_NEST_CRYPTO_KEY',
    schema: Joi.string().length(32).default('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
  })
  key!: string;
}
