import {LocalStrategy} from '#/strategies';
import {UnauthorizedError} from '@repo/domain';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn(() => {
    return class {
      canActivate = jest.fn().mockReturnValue(true);
    };
  }),
}));

const makeSut = async () => {
  const authEnv = {
    PACKAGES_NEST_SESSION_REFRESH_TTL: '10m',
    PACKAGES_NEST_SESSION_ACCESS_TTL: '10m',
  };
  const databaseService = {
    transaction: jest.fn(async (fn: (arg: any) => Promise<any>) => await fn(databaseService)),
    findOne: jest.fn().mockResolvedValue({password: 'hash'}),
  };
  const cryptoService = {
    hash: jest.fn().mockReturnValue('hash'),
  };
  const cacheService = {
    set: jest.fn(),
  };
  const sut = new LocalStrategy(authEnv as any, databaseService as any, cryptoService as any, cacheService as any);
  return {authEnv, databaseService, cryptoService, cacheService, sut};
};

describe('strategies/local.strategy', () => {
  describe('validate', () => {
    it('throws when databaseService.transaction throws', async () => {
      const {databaseService, sut} = await makeSut();
      databaseService.transaction.mockRejectedValue(new Error());
      await expect(sut.validate('', '')).rejects.toThrow();
    });
    it('throws when entityManager.findOne', async () => {
      const {databaseService, sut} = await makeSut();
      databaseService.findOne.mockRejectedValue(new Error());
      await expect(sut.validate('', '')).rejects.toThrow();
    });
    it('throws when cryptoService.hash', async () => {
      const {cryptoService, sut} = await makeSut();
      cryptoService.hash.mockImplementation(() => {
        throw new Error();
      });
      await expect(sut.validate('', '')).rejects.toThrow();
    });
    it('throws when cacheService.set', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.set.mockRejectedValue(new Error());
      await expect(sut.validate('', '')).rejects.toThrow();
    });
    it('throws UnauthorizedError when user not found', async () => {
      const {databaseService, sut} = await makeSut();
      databaseService.findOne.mockResolvedValue(undefined);
      await expect(sut.validate('', '')).rejects.toThrow();
    });
    it("throws UnauthorizedError when user.password doesn't matches", async () => {
      const {databaseService, sut} = await makeSut();
      databaseService.findOne.mockResolvedValue({password: 'unknown'});
      await expect(sut.validate('', '')).rejects.toThrow(UnauthorizedError);
    });
    it('return created session', async () => {
      const {sut} = await makeSut();
      await expect(sut.validate('', '')).resolves.toBeDefined();
    });
  });
});
