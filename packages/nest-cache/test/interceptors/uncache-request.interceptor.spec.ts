import {UncacheRequest} from '#/decorators';
import {UncacheRequestInterceptor} from '#/interceptors';
import 'reflect-metadata';
import {firstValueFrom, of} from 'rxjs';

const makeSut = async () => {
  const cacheEnv = {requestKey: 'requestKey'};
  const cacheService = {del: jest.fn()};
  const loggerService = {warn: jest.fn()};
  const target = {constructor: function Test() {}};
  const context = {
    switchToHttp: jest.fn(() => ({getRequest: () => ({id: 1})})),
    getHandler: jest.fn(() => ({name: 'methodName'})),
    getClass: jest.fn(() => target.constructor),
  };
  const next = {handle: jest.fn(() => of(1))};
  const sut = new UncacheRequestInterceptor(cacheEnv as any, cacheService as any, loggerService as any);
  return {cacheEnv, cacheService, loggerService, target, context, next, sut};
};

describe('interceptors/uncache-request.interceptor', () => {
  describe('intercept', () => {
    it("call next.handle when UncacheRequest.get doesn't return keyOrGeneratorFn", async () => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(UncacheRequest, 'get').mockReturnValue([]);
      sut.intercept(context as any, next);
      expect(next.handle).toHaveBeenCalled();
      expect(cacheService.del).not.toHaveBeenCalled();
    });
    it.each([
      ['string', 'keyOrGeneratorFn'],
      ['function', () => 'keyOrGeneratorFn'],
    ])('call cacheService.get when typeof keyOrGeneratorFn is %s return cached value', async (_, keyOrGeneratorFn) => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(UncacheRequest, 'get').mockReturnValue([keyOrGeneratorFn]);
      cacheService.del.mockResolvedValue('1');
      const result = await firstValueFrom(sut.intercept(context as any, next));
      expect(cacheService.del).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('call loggerService.warn when cacheService.del throws and return fresh value', async () => {
      const {sut, context, cacheService, loggerService, next} = await makeSut();
      jest.spyOn(UncacheRequest, 'get').mockReturnValue(['keyOrGeneratorFn']);
      cacheService.del.mockRejectedValue(new Error());
      await firstValueFrom(sut.intercept(context as any, next));
      expect(cacheService.del).toHaveBeenCalled();
      expect(loggerService.warn).toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
