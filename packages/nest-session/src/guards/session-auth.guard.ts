import {TSession} from '#/session.types';
import {Injectable, type CanActivate, type ExecutionContext} from '@nestjs/common';
import {CryptoService} from '@repo/nest-crypto';
import {UnauthorizedError} from '@truther-coinbase/domain';
import {Request} from 'express';
import {SessionService} from '../session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly sessionService: SessionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & {session?: TSession}>();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Session ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header.');
    }
    try {
      const token = authHeader.split(' ')[1];
      req.session = await this.sessionService.get(this.cryptoService.decrypt(token!));
      if (req.session) {
        return true;
      }
    } catch {
      //
    }
    throw new UnauthorizedError('Session expired.');
  }
}
