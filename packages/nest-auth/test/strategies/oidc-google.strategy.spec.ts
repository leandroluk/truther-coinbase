import {OidcGoogleStrategy} from '#/strategies';

jest.mock('@nestjs/passport', () => ({
  PassportStrategy: jest.fn(() => {
    return class {
      canActivate = jest.fn().mockReturnValue(true);
    };
  }),
}));

const makeSut = async () => {
  const req = {authInfo: {refreshToken: 'refreshToken'}};
  const profile = {displayName: 'displayName', emails: [{value: 'value'}]};
  const authEnv = {
    PACKAGES_NEST_GOOGLE_CLIENT_SECRET: '',
    PACKAGES_NEST_COMMON_BASE_URL: '',
    PACKAGES_NEST_SESSION_REFRESH_TTL: '10m',
    PACKAGES_NEST_SESSION_ACCESS_TTL: '10m',
  };
  const databaseService = {
    transaction: jest.fn(async (fn: (arg: any) => Promise<any>) => await fn(databaseService)),
    findOne: jest.fn().mockResolvedValue({password: 'hash'}),
    create: jest.fn((...args) => args),
    save: jest.fn(),
  };
  const cacheService = {
    set: jest.fn(),
  };
  const sut = new OidcGoogleStrategy(authEnv as any, databaseService as any, cacheService as any);
  return {req, profile, authEnv, databaseService, cacheService, sut};
};

describe('strategies/oidc-google.strategy', () => {
  describe('authorizationParams', () => {
    it('return authorizationParams', async () => {
      const {sut} = await makeSut();
      expect(sut.authorizationParams()).toBeDefined();
    });
  });
  describe('validate', () => {
    it('throw when databaseService.transaction throws', async () => {
      const {req, profile, databaseService, sut} = await makeSut();
      databaseService.transaction.mockRejectedValue(new Error());
      await expect(sut.validate(req, '', profile)).rejects.toThrow();
    });
    it('throw when entityManager.findOne throws', async () => {
      const {req, profile, databaseService, sut} = await makeSut();
      databaseService.findOne.mockRejectedValue(new Error());
      await expect(sut.validate(req, '', profile)).rejects.toThrow();
    });
    it('throw when entityManager.save throws', async () => {
      const {req, profile, databaseService, sut} = await makeSut();
      databaseService.findOne.mockResolvedValue(undefined);
      databaseService.save.mockRejectedValue(new Error());
      await expect(sut.validate(req, '', profile)).rejects.toThrow();
    });
    it('throw when cacheService.set throws', async () => {
      const {req, profile, cacheService, sut} = await makeSut();
      cacheService.set.mockRejectedValue(new Error());
      await expect(sut.validate(req, '', profile)).rejects.toThrow();
    });
    it('return generated session', async () => {
      const {req, profile, databaseService, sut} = await makeSut();
      databaseService.findOne.mockResolvedValue(undefined);
      await expect(sut.validate(req, '', profile)).resolves.toBeDefined();
    });
  });
});
