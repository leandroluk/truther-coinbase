import {CacheRequest} from '#/decorators';
import 'reflect-metadata';

describe('decorators/cache-request.decorator', () => {
  describe('get', () => {
    it.each([
      ['only keyOrGeneratorFn', ['keyOrGeneratorFn', undefined, 60]],
      ['keyOrGeneratorFn with expireInSeconds', ['keyOrGeneratorFn', 123]],
    ])('return metadata set by the decorator passing %s', (_, [keyOrGeneratorFn, expireInSeconds, defaultValue]) => {
      class Test {
        @CacheRequest(keyOrGeneratorFn as string, expireInSeconds as number)
        method() {}
      }
      const classRef = CacheRequest.get(Test, 'method');
      const instanceRef = CacheRequest.get(new Test(), 'method');
      expect(classRef).toEqual([keyOrGeneratorFn, expireInSeconds ?? defaultValue]);
      expect(instanceRef).toEqual([keyOrGeneratorFn, expireInSeconds ?? defaultValue]);
    });
    it('return empty array when', () => {
      class Test {
        method() {}
      }
      const classRef = CacheRequest.get(Test, 'method');
      const instanceRef = CacheRequest.get(new Test(), 'method');
      expect(classRef).toEqual([]);
      expect(instanceRef).toEqual([]);
    });
  });
  describe('hash', () => {
    it('return hash of received value', () => {
      expect(CacheRequest.hash({abc: 123})).toBeDefined();
    });
  });
});
