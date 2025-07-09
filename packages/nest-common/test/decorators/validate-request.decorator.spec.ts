import {ValidateRequest} from '#/decorators/validate-request.decorator';
import {ValidateRequestInterceptor} from '#/interceptors';
import {UseInterceptors} from '@nestjs/common';
import {ApiBadRequestResponse} from '@nestjs/swagger';
import Joi from 'joi';

jest.mock('@nestjs/swagger', () => ({
  ApiBadRequestResponse: jest.fn(() => jest.fn()),
}));

jest.mock('@nestjs/common', () => {
  const original = jest.requireActual('@nestjs/common');
  return {
    ...original,
    UseInterceptors: jest.fn(() => jest.fn()),
  };
});

jest.mock('#/interceptors', () => ({
  ValidateRequestInterceptor: jest.fn(),
}));

describe('decorators/validate-request.decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('apply ApiBadRequestResponse and UseInterceptors with schema', () => {
    const schema = Joi.object({body: Joi.string().required()});
    const target = {};
    const key = 'testMethod';
    const descriptor = {} as TypedPropertyDescriptor<any>;

    ValidateRequest(schema)(target, key, descriptor);

    expect(ApiBadRequestResponse).toHaveBeenCalledWith({description: 'Invalid request'});
    expect(ApiBadRequestResponse).toHaveReturnedWith(expect.any(Function));

    expect(ValidateRequestInterceptor).toHaveBeenCalledWith(schema);
    expect(UseInterceptors).toHaveBeenCalledWith(expect.any(ValidateRequestInterceptor));
    expect(UseInterceptors).toHaveReturnedWith(expect.any(Function));
  });
});
