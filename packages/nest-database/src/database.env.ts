import {Injectable} from '@nestjs/common';
import {Env} from '@repo/nest-common';
import Joi from 'joi';

@Env(
  Joi.object<DatabaseEnv>({
    PACKAGES_NEST_DATABASE_URL: Joi.string().uri().default('postgres://postgres:postgres@localhost:5432/postgres'),
    PACKAGES_NEST_DATABASE_LOGGING: Joi.boolean().truthy('1', 'true').falsy('0', 'false').default(false),
    PACKAGES_NEST_DATABASE_MIGRATE: Joi.boolean().truthy('1', 'true').falsy('0', 'false').default(true),
    PACKAGES_NEST_DATABASE_DEFAULT_LIMIT: Joi.number().integer().positive().default(50),
    PACKAGES_NEST_DATABASE_MOCKUPS: Joi.boolean().truthy('1', 'true').falsy('0', 'false').default(false),
  })
)
@Injectable()
export class DatabaseEnv {
  PACKAGES_NEST_DATABASE_URL!: string;
  PACKAGES_NEST_DATABASE_LOGGING!: boolean;
  PACKAGES_NEST_DATABASE_MIGRATE!: boolean;
  PACKAGES_NEST_DATABASE_DEFAULT_LIMIT!: number;
  PACKAGES_NEST_DATABASE_MOCKUPS!: boolean;
}
