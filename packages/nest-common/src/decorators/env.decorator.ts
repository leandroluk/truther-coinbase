import dotenvx from '@dotenvx/dotenvx';
import {ValidationError} from '@repo/domain';
import {type UpperSnakeCase} from '@repo/domain/dist/types';
import type Joi from 'joi';
import {resolve} from 'path';

const cwd = process.cwd();
const path = [resolve(cwd, '.env'), resolve(cwd, '..', '.env'), resolve(cwd, '../..', '.env')];

dotenvx.config({path, quiet: true, ignore: ['MISSING_ENV_FILE']});

type EnvSchema<T extends Record<string, any>> = {
  [K in keyof T]: K extends string ? (UpperSnakeCase<K> extends never ? never : T[K]) : never;
};

export function Env<T extends Record<string, any>>(schema: Joi.ObjectSchema<EnvSchema<T>>): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    class EnvInjected extends (target as unknown as new (...args: any[]) => object) {
      constructor(...args: any[]) {
        super(...args);
        const {error, value} = schema.validate(process.env, {
          allowUnknown: true,
          stripUnknown: true,
        });
        if (error) {
          throw new ValidationError(`[${target.name}]: ${error.message}`);
        }
        for (const propertyKey in schema.describe().keys) {
          Object.defineProperty(this, propertyKey, {
            value: (value as any)[propertyKey],
            enumerable: true,
            configurable: false,
          });
        }
      }
    }

    return EnvInjected as unknown as TFunction;
  };
}
