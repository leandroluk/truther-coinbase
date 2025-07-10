import {CryptoModule} from '#/crypto.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [CryptoModule]}).compile();
  return {sut};
};

describe('crypto.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
