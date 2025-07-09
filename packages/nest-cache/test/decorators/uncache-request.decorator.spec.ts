import {UncacheRequest} from '#/decorators';
import 'reflect-metadata';

describe('decorators/uncache-request.decorator', () => {
  describe('get', () => {
    it('return metadata set by the decorator', () => {
      class Test {
        @UncacheRequest('keyOrGeneratorFn')
        method() {}
      }
      const classRef = UncacheRequest.get(Test, 'method');
      const instanceRef = UncacheRequest.get(new Test(), 'method');
      expect(classRef).toEqual(['keyOrGeneratorFn']);
      expect(instanceRef).toEqual(['keyOrGeneratorFn']);
    });
    it('return empty array when', () => {
      class Test {
        method() {}
      }
      const classRef = UncacheRequest.get(Test, 'method');
      const instanceRef = UncacheRequest.get(new Test(), 'method');
      expect(classRef).toEqual([]);
      expect(instanceRef).toEqual([]);
    });
  });
});
