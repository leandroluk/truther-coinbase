import {Idempotent} from '#/decorators';
import {IdempotentInterceptor} from '#/interceptors';
import {ConflictException} from '@nestjs/common';
import {lastValueFrom, of} from 'rxjs';

const makeSut = async () => {
  const cacheService = {set: jest.fn()};
  const target = {constructor: function Test() {}};
  const context = {
    getHandler: jest.fn(() => ({name: 'methodName'})),
    getClass: jest.fn(() => target.constructor),
    getArgs: jest.fn(() => [{id: 1}]),
  };
  const next = {handle: jest.fn(() => of('response'))};
  const sut = new IdempotentInterceptor(cacheService as any);
  return {cacheService, target, context, next, sut};
};

describe('interceptors/idempotent.interceptor', () => {
  describe('intercept', () => {
    it("call next.handle without call context.getArgs when isn't idempotent", async () => {
      const {context, next, sut} = await makeSut();
      jest.spyOn(Idempotent, 'get').mockReturnValue(undefined);
      await lastValueFrom(sut.intercept(context as any, next));
      expect(next.handle).toHaveBeenCalled();
      expect(context.getArgs).not.toHaveBeenCalled();
    });

    it("call next.handle without call cacheService.set when doesn't have event id", async () => {
      const {context, cacheService, next, sut} = await makeSut();
      jest.spyOn(Idempotent, 'get').mockReturnValue(true);
      context.getArgs.mockReturnValue([] as any);
      await lastValueFrom(sut.intercept(context as any, next));
      expect(next.handle).toHaveBeenCalled();
      expect(cacheService.set).not.toHaveBeenCalled();
    });

    it('throw when cacheService.set returns null (duplicate event)', async () => {
      const {context, cacheService, next, sut} = await makeSut();
      jest.spyOn(Idempotent, 'get').mockReturnValue(true);
      cacheService.set.mockResolvedValue(null); // simulate duplicate
      await expect(lastValueFrom(sut.intercept(context as any, next))).rejects.toThrow(ConflictException);
      expect(next.handle).not.toHaveBeenCalled();
    });

    it('calls next.handle and passes when event is new', async () => {
      const {context, cacheService, next, sut} = await makeSut();
      jest.spyOn(Idempotent, 'get').mockReturnValue(true);
      cacheService.set.mockResolvedValue('OK'); // simulate successful lock
      const result = await lastValueFrom(sut.intercept(context as any, next));
      expect(result).toBe('response');
      expect(cacheService.set).toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
