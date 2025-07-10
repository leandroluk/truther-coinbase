import {ExtendedQueryRunner} from '#/generics';

const makeSut = async () => {
  const queryRunner = {
    query: jest.fn(),
  };
  const sut = new ExtendedQueryRunner(queryRunner as any);
  return {queryRunner, sut};
};

describe('generics/extended-query-runner', () => {
  describe('insert', () => {
    it('throw when queryRunner throws', async () => {
      const {queryRunner, sut} = await makeSut();
      queryRunner.query.mockRejectedValue(new Error());
      await expect(sut.insert('table', {a: 1})).rejects.toThrow();
    });
    it('return inserted id', async () => {
      const {queryRunner, sut} = await makeSut();
      queryRunner.query.mockResolvedValue([{id: 2}]);
      await expect(sut.insert('table', {a: 1})).resolves.toBe(2);
    });
  });
});
