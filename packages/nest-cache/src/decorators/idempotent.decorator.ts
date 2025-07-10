import 'reflect-metadata';

/**
 * The term idempotent comes from the field of mathematics and computer science
 * and refers to an operation that, when performed multiple times, will always
 * produce the same result. That is, no matter how many times the operation is
 * repeated, the effect will be the same after the first execution.
 */
export const Idempotent = Object.assign(decorator, {
  defaultExpireInSeconds: 3600,
  key: Symbol('Idempotent'),
  get: <T = number>(target: object, propertyKey?: string | symbol): T | undefined => {
    return Reflect.getMetadata(Idempotent.key, (target as any).prototype ?? target, propertyKey as any);
  },
});

function decorator(expireInSeconds = Idempotent.defaultExpireInSeconds): MethodDecorator {
  return function <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    Reflect.defineMetadata(Idempotent.key, expireInSeconds, target, propertyKey);
    return descriptor;
  };
}
