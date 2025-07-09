import {Injectable} from '@nestjs/common';
import {EnvProperty} from '@repo/nest-common';
import Joi from 'joi';
import ms from 'ms';

@Injectable()
export class SessionEnv {
  @EnvProperty({
    name: 'PACKAGES_NEST_SESSION_URL',
    schema: Joi.string().uri().default('redis://localhost:6379/0'),
  })
  url!: string;

  @EnvProperty({
    name: 'PACKAGES_NEST_SESSION_ACCESS_TTL',
    schema: Joi.string().default('1h'),
  })
  accessTtl!: ms.StringValue;

  @EnvProperty({
    name: 'PACKAGES_NEST_SESSION_LIMIT_TTL',
    schema: Joi.string().default('14d'),
  })
  limitTtl!: ms.StringValue;

  @EnvProperty({
    name: 'PACKAGES_NEST_SESSION_SECRET',
    schema: Joi.string().default('secret'),
  })
  secret!: string;
}
