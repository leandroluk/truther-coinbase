import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {UnauthorizedError} from '@repo/domain';
import {Observable} from 'rxjs';

@Injectable()
export class DynamicOidcGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const provider = req.params.provider;
    if (!provider) {
      throw new UnauthorizedError('OIDC provider not specified');
    }
    const {redirect_to} = req.query;
    if (!redirect_to || typeof redirect_to !== 'string') {
      throw new UnauthorizedError('Missing redirect_to query param');
    }
    req.query.state = encodeURIComponent(redirect_to);
    const strategyName = `oidc-${provider}`;
    const guard = new (AuthGuard(strategyName))();
    return guard.canActivate(context);
  }
}
