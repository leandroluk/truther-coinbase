import {CacheRequest} from '#/decorators';
import {CacheRequestInterceptor} from '#/interceptors';
import 'reflect-metadata';
import {firstValueFrom, of} from 'rxjs';

const makeSut = async () => {
  const cacheEnv = {requestKey: 'requestKey'};
  const cacheService = {get: jest.fn(), set: jest.fn()};
  const target = {constructor: function Test() {}};
  const context = {
    switchToHttp: jest.fn(() => ({getRequest: () => ({id: 1})})),
    getHandler: jest.fn(() => ({name: 'methodName'})),
    getClass: jest.fn(() => target.constructor),
  };
  const next = {handle: jest.fn(() => of(1))};
  const sut = new CacheRequestInterceptor(cacheEnv as any, cacheService as any);
  return {cacheEnv, cacheService, target, context, next, sut};
};

describe('interceptors/cache-request.interceptor', () => {
  describe('intercept', () => {
    it("call next.handle when CacheRequest.get doesn't return keyOrGeneratorFn", async () => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(CacheRequest, 'get').mockReturnValue([]);
      sut.intercept(context as any, next);
      expect(next.handle).toHaveBeenCalled();
      expect(cacheService.get).not.toHaveBeenCalled();
    });
    it.each([
      ['string', 'keyOrGeneratorFn'],
      ['function', () => 'keyOrGeneratorFn'],
    ])('call cacheService.get when typeof keyOrGeneratorFn is %s return cached value', async (_, keyOrGeneratorFn) => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(CacheRequest, 'get').mockReturnValue([keyOrGeneratorFn]);
      cacheService.get.mockResolvedValue('1');
      const result = await firstValueFrom(sut.intercept(context as any, next));
      expect(cacheService.get).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(next.handle).not.toHaveBeenCalled();
    });
    it('call next.handle and cacheService.set when cacheService.get throws', async () => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(CacheRequest, 'get').mockReturnValue(['keyOrGeneratorFn']);
      cacheService.get.mockRejectedValue(new Error());
      const result = await firstValueFrom(sut.intercept(context as any, next));
      expect(cacheService.get).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(next.handle).toHaveBeenCalled();
    });
    it('call next.handle and cacheService.set when cacheService.get returns falsy', async () => {
      const {sut, context, cacheService, next} = await makeSut();
      jest.spyOn(CacheRequest, 'get').mockReturnValue(['keyOrGeneratorFn']);
      cacheService.get.mockRejectedValue(new Error());
      const result = await firstValueFrom(sut.intercept(context as any, next));
      expect(cacheService.get).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
