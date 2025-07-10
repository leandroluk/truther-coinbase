import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<CryptoEnv, true>({
    PACKAGES_NEST_CRYPTO_KEY: Joi.string().length(32).default('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
  })
)
@Injectable()
export class CryptoEnv {
  PACKAGES_NEST_CRYPTO_KEY!: string;
}
