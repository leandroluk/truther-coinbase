import {type OpenAPIV3 as O} from 'openapi-types';
import {type Readable} from 'stream';

export type SwaggerBase = O.NonArraySchemaObject & {
  'x-type'?: 'string' | 'number' | 'boolean' | 'date';
};

// prettier-ignore
export type SwaggerObject<T extends object> = Omit<O.NonArraySchemaObject, 'type' | 'required' | 'properties'> & {
  type: 'object';
  required: Array<keyof {[K in keyof T as string extends K ? never : object extends Pick<T, K> ? never : K]: 0}>;
  properties: {
    [K in keyof T]: T[K] extends Array<any>
    ? O.ArraySchemaObject
    : T[K] extends Readable
    ? SwaggerBase
    : T[K] extends Date
    ? SwaggerBase
    : T[K] extends object
    ? SwaggerObject<T[K]>
    : SwaggerBase;
  };
};

export type SwaggerArray<T> = Omit<O.ArraySchemaObject, 'items'> & {
  items: SwaggerProperties<T extends Array<infer U> ? U : T>;
};

export type SwaggerEnum<T> = Omit<SwaggerBase, 'enum'> & {
  enum: Array<T>;
};

// prettier-ignore
export type SwaggerAny<T = unknown> = T extends object
  ? SwaggerObject<T>
  : T extends Array<unknown>
  ? SwaggerArray<T>
  : SwaggerEnum<T> | SwaggerBase;

// prettier-ignore
export type SwaggerProperties<T> =
  T extends Array<any>
  ? SwaggerArray<T>
  : T extends Date
  ? SwaggerBase
  : T extends object
  ? SwaggerObject<T>
  : SwaggerBase;
