import {ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard, IAuthModuleOptions} from '@nestjs/passport';
import {Request} from 'express';

@Injectable()
export class OidcMicrosoftGuard extends AuthGuard('oidc-microsoft') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions {
    const req = context.switchToHttp().getRequest<Request>();
    const {state} = req.query;
    return {
      scope: ['openid', 'profile', 'email'],
      state: typeof state === 'string' ? state : undefined,
    };
  }
}
