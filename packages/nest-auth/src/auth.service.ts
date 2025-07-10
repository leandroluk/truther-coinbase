import {Injectable} from '@nestjs/common';
import {JwtService, JwtSignOptions} from '@nestjs/jwt';
import {TOpenidToken, TSession, UnauthorizedError} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import {CryptoService} from '@repo/nest-crypto';
import {addMilliseconds} from 'date-fns';
import ms from 'ms';
import {AuthEnv} from './auth.env';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly authEnv: AuthEnv,
    private readonly cacheService: CacheService
  ) {}

  async createCode(session: TSession): Promise<string> {
    const milliseconds = ms(this.authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL);
    const ttl = addMilliseconds(new Date(), milliseconds);
    const code = this.cryptoService.encrypt(JSON.stringify({key: session.key, ttl}));
    return code;
  }

  async decodeCode(code: string): Promise<TSession['key']> {
    try {
      const stringfied = this.cryptoService.decrypt(code);
      const {key, ttl} = JSON.parse(stringfied);
      if (new Date() < new Date(ttl)) {
        return key;
      }
    } catch {
      // no need catch it
    }
    throw new UnauthorizedError();
  }

  async createOpenidToken(session: TSession): Promise<TOpenidToken> {
    const options: JwtSignOptions = {
      jwtid: session.key,
      subject: `${session.user.id}`,
    };
    const accessTTL = ms(this.authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000;
    const refreshTTL = ms(this.authEnv.PACKAGES_NEST_SESSION_REFRESH_TTL) / 1000;
    const [access_token, refresh_token, id_token] = await Promise.all([
      this.jwtService.signAsync({}, {...options, expiresIn: accessTTL}),
      this.jwtService.signAsync({}, {...options, expiresIn: refreshTTL}),
      this.jwtService.signAsync(session.user, options),
    ]);
    return {
      access_token,
      expires_in: accessTTL,
      id_token,
      refresh_token,
      token_type: 'Bearer',
    };
  }

  async logoff(session: TSession): Promise<void> {
    await this.cacheService.del(`user:${session.user.id}:session:${session.key}`);
  }
}
