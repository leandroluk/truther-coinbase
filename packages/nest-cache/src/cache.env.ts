import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<CacheEnv, true>({
    PACKAGES_NEST_CACHE_URL: Joi.string().uri().default('redis://localhost:6379/0'),
    PACKAGES_NEST_CACHE_KEY: Joi.string().default('cache'),
    PACKAGES_NEST_CACHE_REQUEST_KEY: Joi.string().default('request'),
  })
)
@Injectable()
export class CacheEnv {
  PACKAGES_NEST_CACHE_URL!: string;
  PACKAGES_NEST_CACHE_KEY!: string;
  PACKAGES_NEST_CACHE_REQUEST_KEY!: string;
}
