import {type OpenAPIV3 as O} from 'openapi-types';
import {type Readable} from 'stream';

export type SwaggerType = O.NonArraySchemaObject & {
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
    ? SwaggerType
    : T[K] extends Date
    ? SwaggerType
    : T[K] extends object
    ? SwaggerObject<T[K]>
    : SwaggerType;
  };
};

export type SwaggerArray<T> = Omit<O.ArraySchemaObject, 'items'> & {
  items: SwaggerProperties<T extends Array<infer U> ? U : T>;
};

export type SwaggerEnum<T> = Omit<SwaggerType, 'enum'> & {
  enum: Array<T>;
};

// prettier-ignore
export type SwaggerAny<T = unknown> = T extends object
  ? SwaggerObject<T>
  : T extends Array<unknown>
  ? SwaggerArray<T>
  : SwaggerEnum<T> | SwaggerType;

// prettier-ignore
export type SwaggerProperties<T> =
  T extends Array<any>
  ? SwaggerArray<T>
  : T extends Date
  ? SwaggerType
  : T extends object
  ? SwaggerObject<T>
  : SwaggerType;
