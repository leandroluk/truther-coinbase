import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<CoingeckoApiEnv>({
    PACKAGES_NEST_COINGECKO_API_BASE_URL: Joi.string().uri().required().default('https://api.coingecko.com/api/v3'),
    PACKAGES_NEST_COINGECKO_API_HEADER: Joi.string().required().default('x-cg-demo-api-key'),
    PACKAGES_NEST_COINGECKO_API_KEY: Joi.string().required().default('PACKAGES_NEST_COINGECKO_API_KEY'),
    PACKAGES_NEST_COINGECKO_API_VS_CURRENCY: Joi.string().required().default('usd'),
  })
)
@Injectable()
export class CoingeckoApiEnv {
  PACKAGES_NEST_COINGECKO_API_BASE_URL!: string;
  PACKAGES_NEST_COINGECKO_API_HEADER!: string;
  PACKAGES_NEST_COINGECKO_API_KEY!: string;
  PACKAGES_NEST_COINGECKO_API_VS_CURRENCY!: string;
}
