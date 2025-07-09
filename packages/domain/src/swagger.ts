import {type OpenAPIV3 as O} from 'openapi-types';
import {type Readable} from 'stream';

export const Swagger = {
  object: <T extends object>(data?: Partial<Omit<Swagger.ObjectType<T>, 'type'>>): Swagger.ObjectType<T> => ({
    type: 'object',
    required: data?.required ?? [],
    properties: (data?.properties ?? {}) as {[K in keyof T]: Swagger.Properties<T[K]>},
  }),

  array: <T = unknown>(data?: Omit<Swagger.ArrayType<T>, 'type'>): Swagger.ArrayType<T> => ({
    type: 'array',
    items: (data?.items ?? {}) as Swagger.ArrayType<T>['items'],
    ...data,
  }),

  boolean: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'boolean',
    ...data,
  }),

  number: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'number',
    ...data,
  }),

  integer: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'integer',
    'x-type': 'number',
    ...data,
  }),

  string: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'string',
    ...data,
  }),

  url: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'string',
    format: 'url',
    ...data,
  }),

  enum: <T>(data?: Omit<Swagger.EnumType<T>, 'type'>): Swagger.EnumType<T> => ({
    type: 'string',
    enum: data?.enum ?? [],
    ...data,
  }),

  email: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'string',
    format: 'email',
    ...data,
  }),

  binary: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'string',
    format: 'binary',
    ...data,
  }),

  date: (data?: Omit<Swagger.BaseType, 'type'>): Swagger.BaseType => ({
    type: 'string',
    'x-type': 'date',
    format: 'date-time',
    ...data,
  }),
};
// prettier-ignore
export namespace Swagger {
  export type BaseType = O.NonArraySchemaObject & {
    'x-type'?: 'string' | 'number' | 'boolean' | 'date';
  };

  export type ObjectType<T extends object> = Omit<O.NonArraySchemaObject, 'type' | 'required' | 'properties'> & {
    type: 'object';
    required: Array<keyof {[K in keyof T as string extends K ? never : object extends Pick<T, K> ? never : K]: 0;}>;
    properties: {
      [K in keyof T]:
      T[K] extends Array<any> ? O.ArraySchemaObject :
      T[K] extends Readable ? BaseType :
      T[K] extends Date ? BaseType :
      T[K] extends object ? ObjectType<T[K]> : BaseType;
    };
  };

  export type ArrayType<T> = Omit<O.ArraySchemaObject, 'items'> & {
    items: Properties<T extends Array<infer U> ? U : T>;
  };

  export type EnumType<T> = Omit<BaseType, 'enum'> & {
    enum: Array<T>;
  };

  export type AnyType<T = unknown> =
    T extends object ? ObjectType<T> :
    T extends Array<unknown> ? ArrayType<T> : EnumType<T> | BaseType

  export type Properties<T> =
    T extends Array<any> ? ArrayType<T> :
    T extends Date ? BaseType :
    T extends object ? ObjectType<T> : BaseType;
}
