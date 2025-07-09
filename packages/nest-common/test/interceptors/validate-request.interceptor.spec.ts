import {ValidateRequestInterceptor} from '#/interceptors/validate-request.interceptor';
import type {ExecutionContext} from '@nestjs/common';
import {ValidationError} from '@repo/domain';
import type Joi from 'joi';
import {of} from 'rxjs';

function makeSut(schemaReturn: any, requestOverrides = {}) {
  const request = {
    params: {p: 'param'},
    query: {q: 'query'},
    headers: {h: 'header'},
    body: {b: 'body'},
    file: undefined,
    files: undefined,
    ...requestOverrides,
  };

  const schemaMock = {
    validate: jest.fn().mockReturnValue(schemaReturn),
  } as unknown as Joi.ObjectSchema<any>;

  const contextMock = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(() => of('next called')),
  };

  const interceptor = new ValidateRequestInterceptor(schemaMock);

  return {interceptor, contextMock, nextMock, request};
}

describe('interceptors/validate-request.interceptor', () => {
  it('throws ValidationError if schema validation fails', () => {
    const {interceptor, contextMock, nextMock} = makeSut({
      error: {message: 'invalid data'},
      value: null,
    });

    expect(() => interceptor.intercept(contextMock, nextMock)).toThrow(ValidationError);
    expect(() => interceptor.intercept(contextMock, nextMock)).toThrow('invalid data');
    expect(nextMock.handle).not.toHaveBeenCalled();
  });

  it('calls next.handle and merges validated values into request', done => {
    const validatedValue = {
      params: {p: 'newParam'},
      query: {q: 'newQuery'},
      headers: {h: 'newHeader'},
      body: {b: 'newBody'},
    };

    const {interceptor, contextMock, nextMock, request} = makeSut({
      error: null,
      value: validatedValue,
    });

    const result = interceptor.intercept(contextMock, nextMock);

    expect(request.params).toEqual(validatedValue.params);
    expect(request.query).toEqual(validatedValue.query);
    expect(request.headers).toEqual(validatedValue.headers);
    expect(request.body).toEqual(validatedValue.body);
    expect(nextMock.handle).toHaveBeenCalled();

    result.subscribe(value => {
      expect(value).toBe('next called');
      done();
    });
  });

  it('does not override request.body if value.body is undefined', () => {
    const originalBody = {b: 'body'};
    const {interceptor, contextMock, nextMock, request} = makeSut(
      {
        error: null,
        value: {
          params: {},
          query: {},
          headers: {},
          body: undefined,
        },
      },
      {body: originalBody}
    );

    interceptor.intercept(contextMock, nextMock);

    expect(request.body).toEqual(originalBody);
  });

  it('assigns to request.body when request.body is undefined and value.body is defined', () => {
    const validatedValue = {
      params: {},
      query: {},
      headers: {},
      body: {foo: 'bar'},
    };
    const {interceptor, contextMock, nextMock, request} = makeSut(
      {
        error: null,
        value: validatedValue,
      },
      {body: undefined}
    );

    interceptor.intercept(contextMock, nextMock);

    expect(request.body).toEqual({foo: 'bar'});
    expect(nextMock.handle).toHaveBeenCalled();
  });

  it('merges validated params, query and headers into request', () => {
    const initialParams = {old: 'param'};
    const initialQuery = {old: 'query'};
    const initialHeaders = {old: 'header'};

    const validatedValue = {
      params: {newParam: 'value'},
      query: {newQuery: 'value'},
      headers: {newHeader: 'value'},
      body: {},
    };

    const {interceptor, contextMock, nextMock, request} = makeSut(
      {error: null, value: validatedValue},
      {params: initialParams, query: initialQuery, headers: initialHeaders}
    );

    interceptor.intercept(contextMock, nextMock);

    expect(request.params).toEqual({...initialParams, ...validatedValue.params});
    expect(request.query).toEqual({...initialQuery, ...validatedValue.query});
    expect(request.headers).toEqual({...initialHeaders, ...validatedValue.headers});
    expect(nextMock.handle).toHaveBeenCalled();
  });
});
