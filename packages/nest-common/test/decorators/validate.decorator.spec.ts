import {Validate} from '#/decorators/validate.decorator';
import Joi from 'joi';

describe('decorators/validate.decorator', () => {
  it('validates all arguments correctly', () => {
    class Service {
      @Validate([Joi.string().required(), Joi.number().required()])
      execute(id: string, amount: number): string {
        return `OK: ${id} x ${amount}`;
      }
    }

    const result = new Service().execute('a', 1);
    expect(result).toBe('OK: a x 1');
  });

  it('throws on invalid uuid argument', () => {
    class Service {
      @Validate([Joi.string().min(2).required(), Joi.number().required()])
      execute(_id: string, _amount: number): void {}
    }
    const service = new Service();
    expect(() => service.execute('a', 5)).toThrow();
  });

  it('throws on invalid number argument', () => {
    class Service {
      @Validate([Joi.string().required(), Joi.number().required()])
      execute(_id: string, _amount: number): void {}
    }

    const service = new Service();
    expect(() => service.execute('a', NaN)).toThrow();
  });

  it('skips validation for undefined schemas', () => {
    class Service {
      @Validate([, Joi.number().min(10)])
      execute(name: string, price: number): string {
        return `${name} = ${price}`;
      }
    }

    const result = new Service().execute('produto', 20);
    expect(result).toBe('produto = 20');
  });

  it('throws a detailed error message including index and Joi error', () => {
    class Service {
      @Validate([Joi.string().email(), Joi.number().positive()])
      call(_email: string, _total: number): void {}
    }

    const service = new Service();
    try {
      service.call('invalid-email', -5);
    } catch (e: any) {
      expect(e.message).toContain('#0');
      expect(e.message).toContain('"value" must be a valid email');
    }
  });
});
