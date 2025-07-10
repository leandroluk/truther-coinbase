import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard, IAuthModuleOptions} from '@nestjs/passport';

@Injectable()
export class OidcGoogleGuard extends AuthGuard('oidc-google') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions {
    const req = context.switchToHttp().getRequest();
    const {state} = req.query;
    return {
      scope: ['openid', 'profile', 'email'],
      state: typeof state === 'string' ? state : undefined,
    };
  }
}
