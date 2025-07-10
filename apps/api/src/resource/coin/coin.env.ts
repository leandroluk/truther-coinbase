import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<CoinEnv, true>({
    APPS_API_RESOUCES_COIN_CRON: Joi.string().required().default('*/30 * * * *'),
    APPS_API_RESOUCES_COIN_RUN_ON_START: Joi.boolean().truthy(1, 'true').falsy(0, 'false').default(false),
  })
)
@Injectable()
export class CoinEnv {
  APPS_API_RESOUCES_COIN_CRON!: string;
  APPS_API_RESOUCES_COIN_RUN_ON_START!: boolean;
}
