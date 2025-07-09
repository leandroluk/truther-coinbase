import {type TrueType} from '../types';

type WithNot<T extends string> = T | `n${T}`;

export type TSearchOperator =
  | TSearchOperatorString
  | TSearchOperatorNumber
  | TSearchOperatorBoolean
  | TSearchOperatorDate
  | TSearchOperatorRange;

export type TSearchOperatorString = WithNot<'eq' | 'like'>;
export type TSearchOperatorNumber = WithNot<'eq' | 'gt' | 'gte' | 'lt' | 'lte'>;
export type TSearchOperatorBoolean = WithNot<'eq'>;
export type TSearchOperatorDate = WithNot<'eq' | 'gt' | 'gte' | 'lt' | 'lte'>;
export type TSearchOperatorRange = WithNot<'in'>;

export type TSearchPagination = {
  offset: number;
  limit: number;
};

export type TSearchQueryFullText = {
  text?: string;
};

// prettier-ignore
export type TSearchWhereMatch<T> = {
  [K in keyof T]?: TrueType<T[K]> extends string
  ? Partial<Record<TSearchOperatorString, string>>
  : TrueType<T[K]> extends number
  ? Partial<Record<TSearchOperatorNumber, number>>
  : TrueType<T[K]> extends boolean
  ? Partial<Record<TSearchOperatorBoolean, boolean>>
  : TrueType<T[K]> extends Date | string
  ? Partial<Record<TSearchOperatorDate, string>>
  : never;
};
export type TSearchWhereRange<T> = {
  [K in keyof T]?: {in?: Array<T[K]>; nin?: Array<T[K]>};
};
export type TSearchWhere<T> = TSearchWhereMatch<T> & TSearchWhereRange<T>;

export type TSearchFieldsSelect<T> = {
  select?: Array<string & keyof T>;
};
export type TSearchFieldsRemove<T> = {
  remove?: Array<string & keyof T>;
};
export type TSearchFields<T> = TSearchFieldsSelect<T> & TSearchFieldsRemove<T>;

export type TSearchSort<T> = {[K in keyof T]?: -1 | 1};

// prettier-ignore
export type TSearchQuery<T> = Partial<TSearchPagination> & TSearchQueryFullText & {
  where?: TSearchWhere<T>;
  fields?: TSearchFields<T>;
  sort?: TSearchSort<T>;
};

export type TSearchResult<TType extends object, TPartial extends boolean = false> = TSearchPagination & {
  items: TPartial extends false ? Array<TType> : Array<Partial<TType>>;
  total: number;
};
