import {Test} from '@nestjs/testing';
import {AppModule} from 'src/app.module';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [AppModule]}).compile();
  return {sut};
};

describe('app.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
