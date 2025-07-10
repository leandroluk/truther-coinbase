import {DatabaseLifecycle} from '#/database.lifecycle';

const makeSut = async () => {
  const databaseService = {connect: jest.fn()};
  const sut = new DatabaseLifecycle(databaseService as any);
  return {databaseService, sut};
};

describe('database.lifecycle', () => {
  describe('onApplicationBootstrap', () => {
    it('throws when databaseService.connect throws', async () => {
      const {databaseService, sut} = await makeSut();
      databaseService.connect.mockRejectedValue(new Error());
      await expect(sut.onApplicationBootstrap()).rejects.toThrow();
    });
    it('return when success', async () => {
      const {sut} = await makeSut();
      await expect(sut.onApplicationBootstrap()).resolves.toBeUndefined();
    });
  });
});
