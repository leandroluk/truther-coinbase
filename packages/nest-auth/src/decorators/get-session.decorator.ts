import {createParamDecorator, type ExecutionContext} from '@nestjs/common';

export const GetSession = createParamDecorator((_: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest().session;
});
