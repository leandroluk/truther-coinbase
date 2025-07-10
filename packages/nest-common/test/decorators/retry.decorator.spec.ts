import {Retry} from '#/decorators/retry.decorator';
import {LoggerService} from '@repo/nest-logger';

jest.mock('@repo/nest-logger', () => ({
  LoggerService: jest.fn().mockImplementation(() => ({
    warn: jest.fn(),
    error: jest.fn(),
  })),
}));

describe('decorators/retry.decorator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throw after exceeding max attempts', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('permafail'));
    class Service {
      @Retry(2, 100)
      async call(value: string) {
        return mockFn(value);
      }
    }
    const service = new Service();
    const resultPromise = service.call('xyz').catch(e => e);
    await jest.advanceTimersByTimeAsync(100 + 200 + 300);
    const error = await resultPromise;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('permafail');
    expect(mockFn.mock.calls.length).toBe(3);
  });

  it('log warn and error with unserializable arguments', async () => {
    const logger = new LoggerService('Service.call') as any;
    const circular: any = {};
    circular.self = circular;
    const mockFn = jest.fn().mockRejectedValueOnce(new Error('fail once')).mockResolvedValue('success');
    class Service {
      @Retry(2, 100)
      async call(a: any) {
        return mockFn(a);
      }
    }
    const service = new Service();
    const resultPromise = service.call(circular);
    await jest.advanceTimersByTimeAsync(100);
    const result = await resultPromise;
    expect(result).toBe('success');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('retry and succeed before reaching max attempts', async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok');
    class Service {
      @Retry(3, 100)
      async call(value: string) {
        return mockFn(value);
      }
    }
    const service = new Service();
    const promise = service.call('abc');
    await jest.advanceTimersByTimeAsync(100 + 200);
    const result = await promise;
    expect(result).toBe('ok');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
