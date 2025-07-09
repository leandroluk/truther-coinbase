import {EnvProperty} from '#/decorators/env-property.decorator';
import {ValidationError} from '@repo/domain';
import Joi from 'joi';

jest.mock('@dotenvx/dotenvx', () => ({
  config: jest.fn(),
}));

describe('decorators/env-property.decorator', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throw ValidationError when value is invalid', () => {
    process.env.PORT = 'not-a-number';
    class Config {
      @EnvProperty({schema: Joi.number().required()})
      port!: number;
    }
    expect(() => new Config().port).toThrow(ValidationError);
  });

  it('use custon name when defined', () => {
    process.env.CUSTOM_ENV = '42';
    class Config {
      @EnvProperty({name: 'CUSTOM_ENV', schema: Joi.number().required()})
      port!: number;
    }
    expect(new Config().port).toBe(42);
  });
  it('reads environment var with valid value', () => {
    process.env.API_KEY = 'my-key';

    class Config {
      @EnvProperty({name: 'API_KEY', schema: Joi.string().required()})
      apiKey!: string;
    }

    const config = new Config();
    expect(config.apiKey).toBe('my-key');
  });
});
