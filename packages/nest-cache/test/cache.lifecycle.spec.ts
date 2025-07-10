import {CacheLifecycle} from '#/cache.lifecycle';

const makeSut = async () => {
  const cacheService = {
    connect: jest.fn(),
  };
  const sut = new CacheLifecycle(cacheService as any);
  return {cacheService, sut};
};
describe('cache.lifecycle', () => {
  describe('onModuleInit', () => {
    it('throws when cacheService.connect throws', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.connect.mockRejectedValue(new Error());
      await expect(sut.onModuleInit()).rejects.toThrow();
    });
    it('return when success', async () => {
      const {sut} = await makeSut();
      await expect(sut.onModuleInit()).resolves.toBeUndefined();
    });
  });
});
