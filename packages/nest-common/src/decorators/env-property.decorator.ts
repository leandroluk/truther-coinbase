import dotenvx from '@dotenvx/dotenvx';
import {ValidationError} from '@repo/domain';
import type Joi from 'joi';
import {resolve} from 'path';

const cwd = process.cwd();
const path = [resolve(cwd, '.env'), resolve(cwd, '..', '.env'), resolve(cwd, '../..', '.env')];

dotenvx.config({path, quiet: true, ignore: ['MISSING_ENV_FILE']});

export function EnvProperty(metadata: {name?: string; schema: Joi.Schema}): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const field = String(propertyKey);
    const key = metadata.name ?? field;
    Object.defineProperty(target, propertyKey, {
      get() {
        const raw = process.env[key];
        const {error, value} = metadata.schema.validate(raw);
        if (error) {
          throw new ValidationError(`"${key}" ~> "${target.constructor.name}.${field}": ${error.message}`);
        }
        return value;
      },
      enumerable: true,
      configurable: false,
    });
  };
}
