import {CacheService} from '#/cache.service';
import Redis from 'ioredis';

jest.mock('ioredis');

const makeSut = async () => {
  const cacheEnv = {PACKAGES_NEST_CACHE_URL: 'url', PACKAGES_NEST_CACHE_KEY: 'key'};
  const loggerService = {
    error: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  };
  const mockStream = {
    listeners: {},
    on: (event: string, cb: Function) => {
      mockStream.listeners[event] = cb;
      return mockStream;
    },
  };
  const redisInstance = {
    connect: jest.fn(),
    ping: jest.fn(),
    keys: jest.fn().mockResolvedValue(['key']),
    get: jest.fn().mockResolvedValue(JSON.stringify({a: 1})),
    multi: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    expire: jest.fn(),
    exec: jest.fn(),
    scanStream: jest.fn().mockReturnValue(mockStream),
    del: jest.fn(),
    exists: jest.fn(),
  };
  jest.mocked(Redis).mockImplementation(() => redisInstance as any);
  const sut = new CacheService(cacheEnv as any, loggerService as any);
  return {cacheEnv, loggerService, sut, redisInstance, mockStream};
};

describe('cache.service', () => {
  describe('connect', () => {
    it('throws when client connect throws', async () => {
      const {loggerService, sut, redisInstance} = await makeSut();
      redisInstance.connect.mockRejectedValue(new Error());
      await expect(sut.connect()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });
    it('return when connect success', async () => {
      const {sut} = await makeSut();
      await expect(sut.connect()).resolves.toBeUndefined();
    });
  });

  describe('ping', () => {
    it('throws when client ping throws', async () => {
      const {loggerService, sut, redisInstance} = await makeSut();
      redisInstance.ping.mockRejectedValue(new Error());
      await expect(sut.ping()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });
    it('return when ping success', async () => {
      const {sut} = await makeSut();
      await expect(sut.ping()).resolves.toBeUndefined();
    });
  });

  describe('get', () => {
    it('returns the value when the key exists', async () => {
      const {sut, redisInstance} = await makeSut();

      const result = await sut.get('pattern');

      expect(redisInstance.keys).toHaveBeenCalledWith('key:pattern');
      expect(redisInstance.get).toHaveBeenCalledWith('key');
      expect(result).toEqual({a: 1});
    });

    it('returns null when no key is found', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.keys.mockResolvedValue([]);

      const result = await sut.get('pattern');

      expect(result).toBeNull();
    });

    it('returns null when get returns undefined', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.get.mockResolvedValue(undefined);

      const result = await sut.get('pattern');

      expect(result).toBeNull();
    });

    it('returns null when JSON.parse throws', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.get.mockResolvedValue('invalid json');

      const result = await sut.get('pattern');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('calls multi.set and exec without expiration', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.exec.mockResolvedValue([]);

      await sut.set('mykey', {foo: 'bar'});

      expect(redisInstance.multi).toHaveBeenCalled();
      expect(redisInstance.set).toHaveBeenCalledWith('key:mykey', JSON.stringify({foo: 'bar'}));
      expect(redisInstance.exec).toHaveBeenCalled();
    });

    it('calls multi.set, expire and exec with expiration', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.expire.mockReturnThis();
      redisInstance.exec.mockResolvedValue([]);

      await sut.set('mykey', {foo: 'bar'}, 60);

      expect(redisInstance.expire).toHaveBeenCalledWith('key:mykey', 60);
      expect(redisInstance.exec).toHaveBeenCalled();
    });
  });

  describe('del', () => {
    it('calls del and logs when keys are found', async () => {
      const {sut, redisInstance, loggerService, mockStream} = await makeSut();
      const delPromise = sut.del('pattern');

      mockStream.listeners['data'](['key1', 'key2']);
      mockStream.listeners['end']();

      await delPromise;

      expect(redisInstance.del).toHaveBeenCalledWith('key1', 'key2');
      expect(loggerService.log).toHaveBeenCalledWith('Deleted 2 cache keys matching pattern "key:pattern"');
    });

    it('logs warning when deletion fails', async () => {
      const {sut, redisInstance, loggerService, mockStream} = await makeSut();
      redisInstance.del.mockRejectedValue(new Error());

      const delPromise = sut.del('pattern');

      mockStream.listeners['data'](['key1']);
      mockStream.listeners['end']();

      await delPromise;

      expect(loggerService.warn).toHaveBeenCalled();
    });

    it('rejects when scan stream emits error', async () => {
      const {sut, mockStream} = await makeSut();

      const delPromise = sut.del('pattern');

      mockStream.listeners['error'](new Error('stream error'));

      await expect(delPromise).rejects.toThrow('stream error');
    });
  });

  describe('has', () => {
    it('returns true when key exists', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.exists.mockResolvedValue(1);

      const result = await sut.has('key');

      expect(redisInstance.exists).toHaveBeenCalledWith('key');
      expect(result).toBe(true);
    });

    it('returns false when key does not exist', async () => {
      const {sut, redisInstance} = await makeSut();
      redisInstance.exists.mockResolvedValue(0);

      const result = await sut.has('key');

      expect(result).toBe(false);
    });
  });

  describe('refresh', () => {
    it('calls expire with correct arguments', async () => {
      const {sut, redisInstance} = await makeSut();

      await sut.refresh('key', 30);

      expect(redisInstance.expire).toHaveBeenCalledWith('key', 30);
    });
  });
});
