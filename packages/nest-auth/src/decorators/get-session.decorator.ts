import {createParamDecorator, type ExecutionContext} from '@nestjs/common';
import {type TSession} from '@repo/domain';
import {type Request} from 'express';

export const GetSession = createParamDecorator(
  (
    _: unknown, //
    context: ExecutionContext
  ) => {
    return context.switchToHttp().getRequest<Request & {session?: TSession}>().session;
  }
);
