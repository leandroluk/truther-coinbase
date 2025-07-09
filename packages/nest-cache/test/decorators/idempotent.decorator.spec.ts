import {Idempotent} from '#/decorators';
import 'reflect-metadata';

describe('decorators/idempotent.decorator', () => {
  describe('get', () => {
    it.each([
      ['without expireInSeconds', [undefined, Idempotent.defaultExpireInSeconds]],
      ['without expireInSeconds', [123]],
    ])('return metadata set by the decorator passing %s', (_, [expireInSeconds, defaultValue]) => {
      class Test {
        @Idempotent(expireInSeconds as number)
        method() {}
      }
      const classRef = Idempotent.get(Test, 'method');
      const instanceRef = Idempotent.get(new Test(), 'method');
      expect(classRef).toEqual(expireInSeconds ?? defaultValue);
      expect(instanceRef).toEqual(expireInSeconds ?? defaultValue);
    });
    it('return true when method is decorated', () => {
      class Test {
        method() {}
      }
      const classRef = Idempotent.get(Test, 'method');
      const instanceRef = Idempotent.get(new Test(), 'method');
      expect(classRef).toBeUndefined();
      expect(instanceRef).toBeUndefined();
    });
  });
});
