import {CacheService} from '#/cache.service';
import {Idempotent} from '#/decorators';
import {CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {from, Observable, switchMap, throwError} from 'rxjs';

@Injectable()
export class IdempotentInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const expiresInSeconds = Idempotent.get(handler);
    const idempotentClass = context.getClass();

    if (!expiresInSeconds) {
      return next.handle();
    }

    const event = context.getArgs()[0];
    const eventId = event?.id;

    if (!eventId) {
      return next.handle();
    }

    const cacheKey = `idempotent:${idempotentClass.name}:${handler.name}:${eventId}`;

    return from(this.cacheService.set(cacheKey, '1', expiresInSeconds)).pipe(
      switchMap(result => {
        if (result === null) {
          return throwError(() => new ConflictException('Duplicate event'));
        }
        return next.handle();
      })
    );
  }
}
