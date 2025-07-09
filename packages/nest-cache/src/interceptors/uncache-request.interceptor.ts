import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {LoggerService} from '@repo/nest-logger';
import {Observable, firstValueFrom, from} from 'rxjs';
import {CacheEnv} from '../cache.env';
import {CacheService} from '../cache.service';
import {UncacheRequest} from '../decorators';

@Injectable()
export class UncacheRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheEnv: CacheEnv,
    private readonly cacheService: CacheService,
    private readonly loggerService: LoggerService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const handler = context.getHandler();
    const [keyOrGeneratorFn] = UncacheRequest.get(handler);
    if (!keyOrGeneratorFn) {
      return next.handle();
    }
    const key = typeof keyOrGeneratorFn === 'string' ? keyOrGeneratorFn : keyOrGeneratorFn(request);
    return from(this.handle(key, next));
  }

  private async handle(key: string, next: CallHandler): Promise<any> {
    const result = await firstValueFrom(next.handle());
    const fullKey = `${this.cacheEnv.requestKey}:${key}`;
    this.cacheService.del(fullKey).catch((error: Error) => {
      this.loggerService.warn(`Failed to delete key ${fullKey}. ${error.message}`);
    });
    return result;
  }
}
