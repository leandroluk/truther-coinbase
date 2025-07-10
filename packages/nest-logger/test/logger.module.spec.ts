import {LoggerModule} from '#/logger.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [LoggerModule]}).compile();
  return {sut};
};

describe('logger.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
