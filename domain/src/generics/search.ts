import {type TrueType} from './types';

export namespace NSearch {
  type WithNot<T extends string> = T | `n${T}`;
  export type Operator = Operator.String | Operator.Number | Operator.Boolean | Operator.Date | Operator.Range;
  export namespace Operator {
    export type String = WithNot<'eq' | 'like'>;
    export type Number = WithNot<'eq' | 'gt' | 'gte' | 'lt' | 'lte'>;
    export type Boolean = WithNot<'eq'>;
    export type Date = WithNot<'eq' | 'gt' | 'gte' | 'lt' | 'lte'>;
    export type Range = WithNot<'in'>;
  }
  export type Pagination = {
    offset: number;
    limit: number;
  };
  export type Query<T> = Query.FullText &
    Partial<Pagination> & {
      where?: Query.Where<T>;
      fields?: Query.Fields<T>;
      sort?: Query.Sort<T>;
    };
  export namespace Query {
    export type FullText = {
      text?: string;
    };
    export type Where<T> = Where.Match<T> & Where.Range<T>;
    export namespace Where {
      export type Match<T> = {
        [K in keyof T]?: TrueType<T[K]> extends string
        ? Partial<Record<Operator.String, string>>
        : TrueType<T[K]> extends number
        ? Partial<Record<Operator.Number, number>>
        : TrueType<T[K]> extends boolean
        ? Partial<Record<Operator.Boolean, boolean>>
        : TrueType<T[K]> extends Date | string
        ? Partial<Record<Operator.Date, string>>
        : never; // prettier-ignore
      };

      export type Range<T> = {
        [K in keyof T]?: {in?: Array<T[K]>; nin?: Array<T[K]>};
      };
    }
    export type Fields<T> = Fields.Select<T> & Fields.Remove<T>;
    export namespace Fields {
      export type Select<T> = {
        select?: Array<string & keyof T>;
      };
      export type Remove<T> = {
        remove?: Array<string & keyof T>;
      };
    }
    export type Sort<T> = {[K in keyof T]?: -1 | 1};
  }
  export type Result<TType extends object, TPartial extends boolean = false> = Pagination & {
    items: TPartial extends false ? Array<TType> : Array<Partial<TType>>;
    total: number;
  };
}
