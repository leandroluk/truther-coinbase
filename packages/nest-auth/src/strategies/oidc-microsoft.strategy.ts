import {AuthEnv} from '#/auth.env';
import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {EOidcProvider, EUserRole, TSession} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import {DatabaseService, UserEntity} from '@repo/nest-database';
import {addMilliseconds} from 'date-fns';
import ms from 'ms';
import {Strategy} from 'passport-openidconnect';

@Injectable()
export class OidcMicrosoftStrategy extends PassportStrategy(Strategy, 'oidc-microsoft') {
  constructor(
    private readonly authEnv: AuthEnv,
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService
  ) {
    super({
      issuer: 'https://login.microsoftonline.com/common/v2.0',
      authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoURL: 'https://graph.microsoft.com/oidc/userinfo',
      clientID: authEnv.PACKAGES_NEST_MICROSOFT_CLIENT_ID,
      clientSecret: authEnv.PACKAGES_NEST_MICROSOFT_CLIENT_SECRET,
      callbackURL: `${authEnv.PACKAGES_NEST_COMMON_BASE_URL}/auth/login/microsoft/callback`,
      scope: ['openid', 'profile', 'email', 'offline_access'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, _issuer: string, profile: any): Promise<TSession> {
    return await this.databaseService.transaction(async entityManager => {
      let user = await entityManager.findOne(UserEntity, {where: {email: profile.emails?.[0]?.value}});
      if (!user) {
        user = entityManager.create(UserEntity, {
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          password: crypto.randomUUID(),
          role: EUserRole.Member,
        });
        await entityManager.save(user);
      }
      delete (user as any).password;
      const session: TSession = {
        key: crypto.randomUUID(),
        ttl: addMilliseconds(new Date(), ms(this.authEnv.PACKAGES_NEST_SESSION_REFRESH_TTL)),
        user,
        provider: EOidcProvider.Microsoft,
        refreshToken: req.authInfo.refreshToken,
      };
      const expiresInSeconds = ms(this.authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000;
      await this.cacheService.set(`user:${user.id}session:${session.key}`, user, expiresInSeconds);
      return session;
    });
  }
}
