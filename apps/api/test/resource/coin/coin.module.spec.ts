import {CoinModule} from '#/resource/coin/coin.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  // const authService = {};
  // const providers = [{provide: AuthService, useValue: authService}];
  // @Module({providers, exports: providers})
  // class MockNestAuthModule {}
  // prettier-ignore
  const sut = await Test.createTestingModule({imports: [CoinModule]})
    // .overrideModule(NestAuthModule).useModule(MockNestAuthModule)
    .compile();
  return {sut};
};

describe('coin.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
