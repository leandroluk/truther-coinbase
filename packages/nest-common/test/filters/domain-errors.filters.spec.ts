import {DomainErrorFilter} from '#/filters/domain-errors.filters';
import {
  type ArgumentsHost,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConflitError,
  NetworkError,
  NotAcceptableError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from '@repo/domain';

class UnknownError extends Error {
  constructor() {
    super('UnknownError');
    this.name = 'UnknownError';
  }
}

const makeSut = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({json}));
  const response = {status, json};
  const ctx = {getResponse: () => response};
  const host = {switchToHttp: () => ctx};
  return {host: host as unknown as ArgumentsHost, response};
};

describe('filters/domain-errors.filters', () => {
  it.each([
    [new NetworkError('network'), ServiceUnavailableException],
    [new NotAcceptableError('not acceptable'), NotAcceptableException],
    [new NotFoundError('not found'), NotFoundException],
    [new ServerError('server'), InternalServerErrorException],
    [new UnauthorizedError('unauthorized'), UnauthorizedException],
    [new ValidationError('invalid'), BadRequestException],
    [new ConflitError('conflict'), ConflictException],
    [new UnknownError(), InternalServerErrorException],
  ])('maps %p to %p', (error, ExpectedException) => {
    const {host, response} = makeSut();
    const filter = new DomainErrorFilter();
    filter.catch(error, host);
    const expectedInstance = new ExpectedException('');
    expect(response.status).toHaveBeenCalledWith(expectedInstance.getStatus());
    expect(response.status().json).toHaveBeenCalledWith({message: error.message});
  });

  it('uses error directly if instance of HttpException', () => {
    const httpError = new BadRequestException('bad');
    const {host, response} = makeSut();
    const filter = new DomainErrorFilter();
    filter.catch(httpError, host);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status().json).toHaveBeenCalledWith({message: 'bad'});
  });

  it('defaults to InternalServerErrorException for unknown error', () => {
    const unknownError = {} as Error;
    const {host, response} = makeSut();
    const filter = new DomainErrorFilter();
    filter.catch(unknownError, host);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.status().json).toHaveBeenCalledWith({message: 'Unknown error'});
  });
});
