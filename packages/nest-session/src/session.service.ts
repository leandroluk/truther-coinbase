import {Injectable} from '@nestjs/common';
import {TUser, UnauthorizedError} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import crypto from 'crypto';
import {addMilliseconds} from 'date-fns';
import ms from 'ms';
import {SessionEnv} from './session.env';
import {TSession} from './session.types';

@Injectable()
export class SessionService {
  readonly cacheUserKey = 'user';
  readonly cacheSessionKey = 'session';

  constructor(
    private readonly sessionEnv: SessionEnv,
    private readonly cacheService: CacheService
  ) {}

  async get(id: string): Promise<TSession | undefined> {
    const key = [this.cacheUserKey, '*', this.cacheSessionKey, id].join(':');
    const session = await this.cacheService.get<TSession>(key);
    if (session) {
      await this.cacheService.refresh(key, ms(this.sessionEnv.accessTtl));
      return session;
    }
  }

  async create(userId: TUser['id']): Promise<string> {
    const ref = crypto.randomUUID();
    const key = [this.cacheUserKey, userId, this.cacheSessionKey, ref].join(':');
    const session: TSession = {userId, ttl: addMilliseconds(new Date(), ms(this.sessionEnv.limitTtl)).getTime()};
    await this.cacheService.set(key, session, ms(this.sessionEnv.accessTtl) / 1000);
    return ref;
  }

  async update(userId: TUser['id'], ref: string): Promise<void> {
    const key = [this.cacheUserKey, userId, this.cacheSessionKey, ref].join(':');
    const session = await this.cacheService.get<TSession>(key);
    if (session && session.ttl > new Date().getDate()) {
      return await this.cacheService.set(key, session, ms(this.sessionEnv.accessTtl) / 1000);
    }
    throw new UnauthorizedError();
  }

  async delete(ref: string): Promise<void> {
    const key = [this.cacheUserKey, '*', this.cacheSessionKey, ref].join(':');
    const exists = await this.cacheService.has(key);
    if (exists) {
      await this.cacheService.del(key);
    }
  }
}
