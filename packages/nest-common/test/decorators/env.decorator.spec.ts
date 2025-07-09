import {Env} from '#/decorators/env.decorator';
import {ValidationError} from '@repo/domain';
import Joi from 'joi';

jest.mock('@dotenvx/dotenvx', () => ({
  config: jest.fn(),
}));

describe('decorators/env.decorator', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('reads and assigns valid environment variables correctly', () => {
    process.env.PORT = '8080';
    process.env.API_KEY = 'my-key';

    @Env(
      Joi.object<Config, true>({
        PORT: Joi.number().required(),
        API_KEY: Joi.string().required(),
      })
    )
    class Config {
      PORT!: number;
      API_KEY!: string;
    }

    const config = new Config();
    expect(config.PORT).toBe(8080);
    expect(config.API_KEY).toBe('my-key');
  });

  it('throws ValidationError when environment variable is invalid', () => {
    process.env.PORT = 'not-a-number';

    @Env(
      Joi.object<Config, true>({
        PORT: Joi.number().required(),
      })
    )
    class Config {
      PORT!: number;
    }

    expect(() => new Config()).toThrow(ValidationError);
  });

  it('ignores unknown environment variables not defined in the schema', () => {
    process.env.PORT = '3000';
    process.env.UNKNOWN = 'should-be-ignored';

    @Env(
      Joi.object<Config, true>({
        PORT: Joi.number().required(),
      })
    )
    class Config {
      PORT!: number;
    }

    const config = new Config();
    expect(config.PORT).toBe(3000);
    expect((config as any).UNKNOWN).toBeUndefined();
  });
});
