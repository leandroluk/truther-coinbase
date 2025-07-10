import {AuthEnv} from '#/auth.env';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {TSession} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import {CryptoService} from '@repo/nest-crypto';
import {DatabaseService, UserEntity} from '@repo/nest-database';
import {addMilliseconds} from 'date-fns';
import ms from 'ms';
import {IStrategyOptions, Strategy} from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authEnv: AuthEnv,
    private readonly databaseService: DatabaseService,
    private readonly cryptoService: CryptoService,
    private readonly cacheService: CacheService
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } satisfies IStrategyOptions);
  }

  async validate(email: string, password: string): Promise<TSession> {
    return await this.databaseService.transaction(async entityManager => {
      const user = await entityManager.findOne(UserEntity, {where: {email}});
      if (user && user.password === this.cryptoService.hash(password)) {
        delete (user as any).password;
        const session: TSession = {
          key: crypto.randomUUID(),
          ttl: addMilliseconds(new Date(), ms(this.authEnv.PACKAGES_NEST_SESSION_REFRESH_TTL)),
          user,
        };
        const expiresInSeconds = ms(this.authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000;
        await this.cacheService.set(`user:${user.id}session:${session.key}`, user, expiresInSeconds);
        return session;
      }
      throw new UnauthorizedException();
    });
  }
}
