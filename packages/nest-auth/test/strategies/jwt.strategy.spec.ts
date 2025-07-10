import {JwtStrategy} from '#/strategies/jwt.strategy';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn(() => {
    return class {
      canActivate = jest.fn().mockReturnValue(true);
    };
  }),
}));

const makeSut = async () => {
  const authEnv = {
    PACKAGES_NEST_COMMON_JWT_PUBLIC_KEY: '',
    PACKAGES_NEST_COMMON_JWT_ALGORITHM: '',
    PACKAGES_NEST_COMMON_JWT_AUDIENCE: '',
    PACKAGES_NEST_COMMON_JWT_ISSUER: '',
    PACKAGES_NEST_SESSION_ACCESS_TTL: '10m',
  };
  const cacheService = {
    get: jest.fn(),
    refresh: jest.fn(),
  };
  const sut = new JwtStrategy(authEnv as any, cacheService as any);
  return {authEnv, cacheService, sut};
};

describe('strategies/jwt.strategy', () => {
  describe('validate', () => {
    it('throw when cacheService.get throws', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.get.mockRejectedValue(new Error());
      await expect(sut.validate({})).rejects.toThrow();
    });
    it('throw when cacheService.refresh throws', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.get.mockResolvedValue({});
      cacheService.refresh.mockRejectedValue(new Error());
      await expect(sut.validate({})).rejects.toThrow();
    });
    it('throw UnauthorizedError when cacheService.get return falsy', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.get.mockResolvedValue(undefined);
      await expect(sut.validate({})).rejects.toThrow();
    });
    it('return session on success', async () => {
      const {cacheService, sut} = await makeSut();
      cacheService.get.mockResolvedValue({});
      cacheService.refresh.mockResolvedValue({});
      await expect(sut.validate({})).resolves.toBeDefined();
    });
  });
});
