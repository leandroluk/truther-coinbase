import {Injectable} from '@nestjs/common';
import {EnvProperty} from '@repo/nest-common';
import Joi from 'joi';

@Injectable()
export class CacheEnv {
  @EnvProperty({
    name: 'PACKAGES_NEST_CACHE_URL',
    schema: Joi.string().uri().default('redis://localhost:6379/0'),
  })
  url!: string;

  @EnvProperty({
    name: 'PACKAGES_NEST_CACHE_KEY',
    schema: Joi.string().default('cache'),
  })
  key!: string;

  @EnvProperty({
    name: 'PACKAGES_NEST_CACHE_REQUEST_KEY',
    schema: Joi.string().default('request'),
  })
  requestKey!: string;
}
