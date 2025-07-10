import {Module, Provider} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {CacheModule} from '@repo/nest-cache';
import {CryptoModule} from '@repo/nest-crypto';
import {DatabaseModule} from '@repo/nest-database';
import ms from 'ms';
import {AuthEnv} from './auth.env';
import {AuthService} from './auth.service';
import * as guards from './guards';
import * as strategies from './strategies';

const providers = Array<Provider>().concat(
  AuthEnv, //
  AuthService,
  Object.values(guards),
  Object.values(strategies)
);

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    CryptoModule,
    CacheModule,
    JwtModule.registerAsync({
      extraProviders: [AuthEnv],
      inject: [AuthEnv],
      useFactory(authEnv: AuthEnv) {
        return {
          privateKey: authEnv.PACKAGES_NEST_COMMON_JWT_PRIVATE_KEY,
          publicKey: authEnv.PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY,
          signOptions: {
            algorithm: authEnv.PACKAGES_NEST_COMMON_JWT_ALGORITHM,
            issuer: authEnv.PACKAGES_NEST_COMMON_JWT_ISSUER,
            audience: authEnv.PACKAGES_NEST_COMMON_JWT_AUDIENCE,
            expiresIn: ms(authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL),
          },
          verifyOptions: {
            algorithms: [authEnv.PACKAGES_NEST_COMMON_JWT_ALGORITHM],
            audience: authEnv.PACKAGES_NEST_COMMON_JWT_AUDIENCE,
            issuer: authEnv.PACKAGES_NEST_COMMON_JWT_ISSUER,
          },
        };
      },
    }),
  ],
  providers,
  exports: providers,
})
export class AuthModule {}
