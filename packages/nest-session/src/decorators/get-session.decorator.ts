import {createParamDecorator, type ExecutionContext} from '@nestjs/common';
import {type TUser} from '@truther-coinbase/domain';
import {type Request} from 'express';

export const GetSession = createParamDecorator((_: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest<Request & {user?: Omit<TUser, 'password'>}>().user;
});
