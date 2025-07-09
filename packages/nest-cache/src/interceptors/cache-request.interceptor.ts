import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable, firstValueFrom, from} from 'rxjs';
import {CacheEnv} from '../cache.env';
import {CacheService} from '../cache.service';
import {CacheRequest} from '../decorators';

@Injectable()
export class CacheRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheEnv: CacheEnv,
    private readonly cacheService: CacheService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const handler = context.getHandler();
    const [keyOrGeneratorFn, expireInSeconds] = CacheRequest.get(handler);
    if (!keyOrGeneratorFn) {
      return next.handle();
    }
    const key = typeof keyOrGeneratorFn === 'string' ? keyOrGeneratorFn : keyOrGeneratorFn(request);
    return from(this.handle(`${this.cacheEnv.requestKey}:${key}`, next, expireInSeconds));
  }

  private async handle(key: string, next: CallHandler, expireInSeconds?: number): Promise<any> {
    try {
      const cached = await this.cacheService.get(key);
      if (cached) {
        return cached;
      }
    } catch {
      //
    }
    const result = await firstValueFrom(next.handle());
    void this.cacheService.set(key, result, expireInSeconds);
    return result;
  }
}
