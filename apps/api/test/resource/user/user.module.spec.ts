import {UserModule} from '#/resource/user/user.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  // prettier-ignore
  const sut = await Test.createTestingModule({imports: [UserModule]})
    .compile()
  return {sut};
};

describe('user.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
