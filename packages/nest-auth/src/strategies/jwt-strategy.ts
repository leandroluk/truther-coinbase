import {AuthEnv} from '#/auth.env';
import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Request} from 'express';
import {ExtractJwt, Strategy, StrategyOptionsWithRequest} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(commonEnv: AuthEnv) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey:
        commonEnv.PACKAGES_NEST_COMMON_JWT_SECRET_OR_PRIVATE_KEY ??
        commonEnv.PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY!, // prettier-ignore
      algorithms: [commonEnv.PACKAGES_NEST_COMMON_JWT_ALGORITHM],
      audience: commonEnv.PACKAGES_NEST_COMMON_JWT_AUDIENCE,
      issuer: commonEnv.PACKAGES_NEST_COMMON_JWT_ISSUER,
    } as StrategyOptionsWithRequest);
  }

  async validate(_req: Request): Promise<boolean> {
    return true;
  }
}
