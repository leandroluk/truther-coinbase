import {Injectable} from '@nestjs/common';
import {JwtSignOptions} from '@nestjs/jwt';
import {Env} from '@repo/nest-common';
import Joi from 'joi';
import ms from 'ms';

@Env(
  Joi.object<AuthEnv>({
    PACKAGES_NEST_COMMON_BASE_URL: Joi.string().required().default('http://localhost:3000'),
    PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY: Joi.string().optional(),
    PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY: Joi.string().optional(),
    PACKAGES_NEST_COMMON_JWT_ALGORITHM: Joi.string().default('HS256'),
    PACKAGES_NEST_COMMON_JWT_AUDIENCE: Joi.string().default('jwtAudience'),
    PACKAGES_NEST_COMMON_JWT_ISSUER: Joi.string().default('jwtIssuer'),
    PACKAGES_NEST_MICROSOFT_CLIENT_ID: Joi.string().default('{{PACKAGES_NEST_MICROSOFT_CLIENT_ID}}'),
    PACKAGES_NEST_MICROSOFT_CLIENT_SECRET: Joi.string().default('{{PACKAGES_NEST_MICROSOFT_CLIENT_SECRET}}'),
    PACKAGES_NEST_GOOGLE_CLIENT_ID: Joi.string().default('{{PACKAGES_NEST_GOOGLE_CLIENT_ID}}'),
    PACKAGES_NEST_GOOGLE_CLIENT_SECRET: Joi.string().default('{{PACKAGES_NEST_GOOGLE_CLIENT_SECRET}}'),
    PACKAGES_NEST_SESSION_ACCESS_TTL: Joi.string().default('10m'),
    PACKAGES_NEST_SESSION_REFRESH_TTL: Joi.string().default('14d'),
  })
)
@Injectable()
export class AuthEnv {
  PACKAGES_NEST_COMMON_BASE_URL!: string;
  PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY!: string;
  PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY!: string;
  PACKAGES_NEST_COMMON_JWT_ALGORITHM!: Exclude<JwtSignOptions['algorithm'], undefined>;
  PACKAGES_NEST_COMMON_JWT_AUDIENCE!: string;
  PACKAGES_NEST_COMMON_JWT_ISSUER!: string;
  PACKAGES_NEST_MICROSOFT_CLIENT_ID!: string;
  PACKAGES_NEST_MICROSOFT_CLIENT_SECRET!: string;
  PACKAGES_NEST_GOOGLE_CLIENT_ID!: string;
  PACKAGES_NEST_GOOGLE_CLIENT_SECRET!: string;
  PACKAGES_NEST_SESSION_ACCESS_TTL!: ms.StringValue;
  PACKAGES_NEST_SESSION_REFRESH_TTL!: ms.StringValue;
}
