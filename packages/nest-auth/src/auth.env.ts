import {Injectable} from '@nestjs/common';
import {JwtSignOptions} from '@nestjs/jwt';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<AuthEnv>({
    PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY: Joi.string().optional(),
    PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY: Joi.string().optional(),
    PACKAGES_NEST_COMMON_JWT_SECRET_OR_PRIVATE_KEY: Joi.string().optional(),
    PACKAGES_NEST_COMMON_JWT_ALGORITHM: Joi.string().default('HS256'),
    PACKAGES_NEST_COMMON_JWT_AUDIENCE: Joi.string().default('jwtAudience'),
    PACKAGES_NEST_COMMON_JWT_ISSUER: Joi.string().default('jwtIssuer'),
    PACKAGES_NEST_COMMON_JWT_EXPIRES: Joi.string().default('10m'),
  }).xor('jwtPrivateKey', 'jwtSecretOrPrivateKey')
)
@Injectable()
export class AuthEnv {
  PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY?: string;
  PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY?: string;
  PACKAGES_NEST_COMMON_JWT_SECRET_OR_PRIVATE_KEY?: string;
  PACKAGES_NEST_COMMON_JWT_ALGORITHM!: Exclude<JwtSignOptions['algorithm'], undefined>;
  PACKAGES_NEST_COMMON_JWT_AUDIENCE!: string;
  PACKAGES_NEST_COMMON_JWT_ISSUER!: string;
  PACKAGES_NEST_COMMON_JWT_EXPIRES!: string;
}
