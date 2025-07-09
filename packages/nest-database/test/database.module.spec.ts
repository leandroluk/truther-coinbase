import {DatabaseEnv} from '#/database.env';
import {DatabaseModule} from '#/database.module';
import {Test} from '@nestjs/testing';

const makeSut = async () => {
  const sut = await Test.createTestingModule({imports: [DatabaseModule]})
    .overrideProvider(DatabaseEnv)
    .useValue({})
    .compile();
  return {sut};
};

describe('database.module', () => {
  it('compile module successful', async () => {
    const {sut} = await makeSut();
    expect(sut).toBeDefined();
  });
});
