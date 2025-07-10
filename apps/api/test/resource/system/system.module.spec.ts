import {SystemModule} from '#/resource';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  // prettier-ignore
  const sut = await Test.createTestingModule({imports: [SystemModule]})
    .compile();
  return {sut};
};

describe('system.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
