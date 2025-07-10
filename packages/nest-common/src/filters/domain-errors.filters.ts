import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
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
import {Response} from 'express';

const errorMap = {
  [NetworkError.name]: ServiceUnavailableException,
  [NotAcceptableError.name]: NotAcceptableException,
  [NotFoundError.name]: NotFoundException,
  [ServerError.name]: InternalServerErrorException,
  [UnauthorizedError.name]: UnauthorizedException,
  [ValidationError.name]: BadRequestException,
  [ConflitError.name]: ConflictException,
};

@Catch()
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let httpError: HttpException;
    if (error instanceof HttpException) {
      httpError = error;
    } else if (error instanceof Error) {
      httpError = new (errorMap[error.name] ?? InternalServerErrorException)(error.message);
    } else {
      httpError = new InternalServerErrorException('Unknown error');
    }

    const status = httpError.getStatus();
    const {message} = httpError.getResponse() as HttpExceptionBody;

    response.status(status).json({message});
  }
}
