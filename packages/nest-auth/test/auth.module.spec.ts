import {AuthModule} from '#/auth.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [AuthModule]}).compile();
  return {sut};
};

describe('auth.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
