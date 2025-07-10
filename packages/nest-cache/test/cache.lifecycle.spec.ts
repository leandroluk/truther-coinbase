import {CacheLifecycle} from '#/cache.lifecycle';

const makeSut = async () => {
  const cacheService = {
    connect: jest.fn(),
  };
  const sut = new CacheLifecycle(cacheService as any);
  return {cacheService, sut};
};
describe('cache.lifecycle', () => {
  describe('onApplicationBootstrap', () => {
    it('throws when cacheService.connect throws', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.connect.mockRejectedValue(new Error());
      await expect(sut.onApplicationBootstrap()).rejects.toThrow();
    });
    it('return when success', async () => {
      const {sut} = await makeSut();
      await expect(sut.onApplicationBootstrap()).resolves.toBeUndefined();
    });
  });
});
