import {AuthModule} from '#/resource/auth/auth.module';
import {Module} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {AuthService, AuthModule as NestAuthModule} from '@repo/nest-auth';

const makeSut = async () => {
  const authService = {};
  const providers = [{provide: AuthService, useValue: authService}];
  @Module({providers, exports: providers})
  class MockNestAuthModule {}
  // prettier-ignore
  const sut = await Test.createTestingModule({imports: [AuthModule]})
    .overrideModule(NestAuthModule).useModule(MockNestAuthModule)
    .compile();
  return {sut};
};

describe('auth.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
