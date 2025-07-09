import {UseInterceptors} from '@nestjs/common';
import {UncacheRequestInterceptor} from '../interceptors';

/**
 * This decorator is used to invalidate or bypass a previously cached response.
 * It allows you to specify a cache key (or a function to generate it) whose entry
 * should be cleared or ignored for the current request.
 */
export const UncacheRequest = Object.assign(decorator, {
  key: Symbol('UncacheRequest'),
  get: <T = Parameters<typeof decorator>>(target: object, propertyKey?: string | symbol): T => {
    return (
      Reflect.getMetadata(UncacheRequest.key, (target as any).prototype ?? target, propertyKey as any) ?? ([] as T)
    );
  },
});

function decorator(keyOrGeneratorFn: string | ((req: Request) => string)): MethodDecorator {
  return function <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    Reflect.defineMetadata(UncacheRequest.key, [keyOrGeneratorFn], target, propertyKey);
    UseInterceptors(UncacheRequestInterceptor)(target, propertyKey, descriptor);
    return descriptor;
  };
}
