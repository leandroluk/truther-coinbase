import {ValidateRequestInterceptor} from '#/interceptors';
import {UseInterceptors} from '@nestjs/common';
import {ApiBadRequestResponse} from '@nestjs/swagger';
import {type Request} from 'express';
import type Joi from 'joi';

export function ValidateRequest<T extends Partial<Request> = Partial<Request>>(
  schema: Joi.ObjectSchema<T>
): MethodDecorator {
  return function <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
    ApiBadRequestResponse({description: 'Invalid request'})(target, propertyKey, descriptor);
    UseInterceptors(new ValidateRequestInterceptor(schema))(target, propertyKey, descriptor);
  };
}
