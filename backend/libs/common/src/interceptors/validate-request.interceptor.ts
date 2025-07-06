import {type CallHandler, type ExecutionContext, type NestInterceptor} from '@nestjs/common';
import {ValidationError} from '@truther-coinbase/domain';
import {type Request} from 'express';
import type Joi from 'joi';
import {type Observable} from 'rxjs';

export class ValidateRequestInterceptor implements NestInterceptor {
  constructor(readonly schema: Joi.ObjectSchema<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const data = {
      params: request.params,
      query: request.query,
      headers: request.headers,
      body: request.body,
      file: request.file,
      files: request.files,
    };
    const {error, value} = this.schema.validate(data, {
      abortEarly: true,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      throw new ValidationError(error.message);
    }
    Object.assign(request.params, value.params);
    Object.assign(request.query, value.query);
    Object.assign(request.headers, value.headers);
    if (request.body === undefined && value.body !== undefined) {
      request.body = value.body;
    } else {
      Object.assign(request.body, value.body);
    }
    return next.handle();
  }
}
