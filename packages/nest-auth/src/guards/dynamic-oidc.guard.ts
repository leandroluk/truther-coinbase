import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {UnauthorizedError} from '@repo/domain';
import {Request} from 'express';
import {Observable} from 'rxjs';

@Injectable()
export class DynamicOidcGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const provider = req.params.provider;
    if (!provider) {
      throw new UnauthorizedError('OIDC provider not specified');
    }
    const redirectTo = req.query.redirect_to as string;
    if (!redirectTo || typeof redirectTo !== 'string') {
      throw new UnauthorizedError('Missing redirect_to query param');
    }
    req.query.state = encodeURIComponent(redirectTo);
    const strategyName = `oidc-${provider}`;
    const guard = new (AuthGuard(strategyName))();
    return guard.canActivate(context);
  }
}
