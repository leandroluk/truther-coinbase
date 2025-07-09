import {CacheRequestInterceptor} from '#/interceptors';
import {UseInterceptors} from '@nestjs/common';
import crypto from 'crypto';
import 'reflect-metadata';

/**
 * This decorator is used to cache the response of a request for a given duration.
 * It works by computing a unique cache key for the request, and reusing the response
 * if the same request is made again within the specified expiration time.
 */
export const CacheRequest = Object.assign(decorator, {
  key: Symbol('CacheRequest'),
  get: <T = Parameters<typeof decorator>>(target: object, propertyKey?: string | symbol): T => {
    return Reflect.getMetadata(CacheRequest.key, (target as any).prototype ?? target, propertyKey as any) ?? ([] as T);
  },
  hash: (body: any): string => crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex'),
});

function decorator(
  keyOrGeneratorFn: string | ((req: Request) => string), //
  expireInSeconds = 60
): MethodDecorator {
  return function <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    Reflect.defineMetadata(CacheRequest.key, [keyOrGeneratorFn, expireInSeconds], target, propertyKey);
    UseInterceptors(CacheRequestInterceptor)(target, propertyKey, descriptor);
    return descriptor;
  };
}
