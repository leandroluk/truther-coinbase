import {AuthService} from '#/auth.service';
import {UnauthorizedError, type TSession} from '@repo/domain';
import ms from 'ms';

const makeSut = async () => {
  const encrypt = jest.fn();
  const decrypt = jest.fn();
  const signAsync = jest.fn();

  const cryptoService = {encrypt, decrypt};
  const jwtService = {signAsync};
  const authEnv = {
    PACKAGES_NEST_SESSION_ACCESS_TTL: '10m' as ms.StringValue,
    PACKAGES_NEST_SESSION_REFRESH_TTL: '20m' as ms.StringValue,
  };
  const cacheService = {del: jest.fn()};
  const session = {key: 'test-key', user: {id: 'user-id'}} as unknown as TSession;

  const sut = new AuthService(cryptoService as any, jwtService as any, authEnv as any, cacheService as any);

  return {cryptoService, jwtService, authEnv, cacheService, session, sut, encrypt, decrypt, signAsync};
};

describe('auth.service', () => {
  describe('createCode', () => {
    it('should return the encrypted code', async () => {
      const {sut, session, encrypt} = await makeSut();
      encrypt.mockReturnValue('encrypted-code');
      const result = await sut.createCode(session);
      expect(encrypt).toHaveBeenCalled();
      expect(result).toBe('encrypted-code');
    });
  });

  describe('decodeCode', () => {
    it('should return the session key if code is valid and not expired', async () => {
      const {sut, decrypt, session} = await makeSut();
      const ttl = new Date(Date.now() + 60_000).toISOString();
      decrypt.mockReturnValue(JSON.stringify({key: session.key, ttl}));

      const result = await sut.decodeCode('some-code');
      expect(result).toBe(session.key);
    });

    it('should throw UnauthorizedError if code is expired', async () => {
      const {sut, decrypt, session} = await makeSut();
      const ttl = new Date(Date.now() - 60_000).toISOString();
      decrypt.mockReturnValue(JSON.stringify({key: session.key, ttl}));

      await expect(sut.decodeCode('some-code')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if decrypt fails', async () => {
      const {sut, decrypt} = await makeSut();
      decrypt.mockImplementation(() => {
        throw new Error('fail');
      });

      await expect(sut.decodeCode('some-code')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if JSON is malformed', async () => {
      const {sut, decrypt} = await makeSut();
      decrypt.mockReturnValue('invalid-json');

      await expect(sut.decodeCode('some-code')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('createOpenidToken', () => {
    it('should return the openid token object', async () => {
      const {sut, signAsync, session, authEnv} = await makeSut();
      signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token')
        .mockResolvedValueOnce('id_token');

      const result = await sut.createOpenidToken(session);

      expect(signAsync).toHaveBeenNthCalledWith(
        1,
        {},
        expect.objectContaining({
          jwtid: session.key,
          subject: session.user.id,
          expiresIn: ms(authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000,
        })
      );
      expect(signAsync).toHaveBeenNthCalledWith(
        2,
        {},
        expect.objectContaining({
          jwtid: session.key,
          subject: session.user.id,
          expiresIn: ms(authEnv.PACKAGES_NEST_SESSION_REFRESH_TTL) / 1000,
        })
      );
      expect(signAsync).toHaveBeenNthCalledWith(
        3,
        session.user,
        expect.objectContaining({jwtid: session.key, subject: session.user.id})
      );

      expect(result).toEqual({
        access_token: 'access_token',
        expires_in: ms(authEnv.PACKAGES_NEST_SESSION_ACCESS_TTL) / 1000,
        id_token: 'id_token',
        refresh_token: 'refresh_token',
        token_type: 'Bearer',
      });
    });
  });

  describe('logoff', () => {
    it('should call cacheService.del with correct key', async () => {
      const {sut, session, cacheService} = await makeSut();
      await sut.logoff(session);
      expect(cacheService.del).toHaveBeenCalledWith(`user:${session.user.id}:session:${session.key}`);
    });

    it('should throw when cacheService.del throws', async () => {
      const {cacheService, session, sut} = await makeSut();
      cacheService.del.mockRejectedValue(new Error('fail'));
      await expect(sut.logoff(session)).rejects.toThrow('fail');
    });
  });
});
