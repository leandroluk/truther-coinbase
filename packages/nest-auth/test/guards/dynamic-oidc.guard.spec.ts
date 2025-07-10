import {DynamicOidcGuard} from '#/guards/dynamic-oidc.guard';
import {type ExecutionContext} from '@nestjs/common';
import {UnauthorizedError} from '@repo/domain';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => {
    return class {
      canActivate = jest.fn().mockReturnValue(true);
    };
  }),
}));

const makeSut = async () => {
  const req: any = {params: {provider: 'provider'}, query: {redirect_to: 'redirect_to'}};
  const context = {switchToHttp: () => ({getRequest: () => req})} as ExecutionContext;
  const sut = new DynamicOidcGuard();
  return {req, context, sut};
};

describe('guards/dynamic-oidc.guard', () => {
  describe('canActivate', () => {
    it("throw when req.params.provider isn't defined", async () => {
      const {req, context, sut} = await makeSut();
      req.params.provider = undefined;
      expect(() => sut.canActivate(context)).toThrow(UnauthorizedError);
    });
    it("throw when req.query.redirect_to isn't passed", async () => {
      const {req, context, sut} = await makeSut();
      req.query.redirect_to = undefined;
      expect(() => sut.canActivate(context)).toThrow(UnauthorizedError);
    });
    it('call canActivate from guard', async () => {
      const {context, sut} = await makeSut();
      await expect(Promise.resolve(sut.canActivate(context))).resolves.toBeDefined();
    });
  });
});
