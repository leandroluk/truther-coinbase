import {CoingeckoApiModule} from '#/coingecko-api.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [CoingeckoApiModule]}).compile();
  return {sut};
};

describe('coingecko-api.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
