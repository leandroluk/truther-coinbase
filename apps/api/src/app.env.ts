import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<AppEnv, true>({
    APPS_API_PORT: Joi.number().integer().positive().default(4000),
    APPS_API_PREFIX: Joi.string().default('').allow(''),
    APPS_API_ORIGIN: Joi.string().default('*'),
  })
)
@Injectable()
export class AppEnv {
  APPS_API_PORT!: number;
  APPS_API_PREFIX!: string;
  APPS_API_ORIGIN!: string;
}
