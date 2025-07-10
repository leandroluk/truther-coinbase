import {AuthEnv} from '#/auth.env';
import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {TSession, UnauthorizedError} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import ms from 'ms';
import {ExtractJwt, Strategy, StrategyOptionsWithRequest} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authEnv: AuthEnv,
    private readonly cacheService: CacheService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: authEnv.PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY,
      algorithms: [authEnv.PACKAGES_NEST_COMMON_JWT_ALGORITHM],
      audience: authEnv.PACKAGES_NEST_COMMON_JWT_AUDIENCE,
      issuer: authEnv.PACKAGES_NEST_COMMON_JWT_ISSUER,
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: any): Promise<TSession> {
    const key = `user:${payload.sub}session:${payload.jti}`;
    const session = await this.cacheService.get<TSession>(key);
    if (session) {
      const expiresInSeconds = ms(this.authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000;
      await this.cacheService.refresh(key, expiresInSeconds);
      return session;
    }
    throw new UnauthorizedError();
  }
}
