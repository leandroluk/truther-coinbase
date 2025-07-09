import type Joi from 'joi';

export function Validate(validators: Array<Joi.AnySchema | undefined>): MethodDecorator {
  return function (target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: object, ...args: any[]): any {
      validators.forEach((schema, index) => {
        if (schema) {
          const {error} = schema.validate(args[index]);
          if (error) {
            throw new Error(`[${target.constructor.name}] Invalid parameter #${index}: ${error.message}`);
          }
        }
      });
      return originalMethod!.apply(this, args);
    };
  };
}
