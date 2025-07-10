import {
  type TSearchOperatorBoolean,
  type TSearchOperatorDate,
  type TSearchOperatorNumber,
  type TSearchOperatorRange,
  type TSearchOperatorString,
} from '#/types';

export const SEARCH = {
  OPERATOR: {
    range: ['in', 'nin'] as Array<TSearchOperatorRange>,
    string: ['eq', 'like', 'neq', 'nlike'] as Array<TSearchOperatorString>,
    number: ['eq', 'gt', 'gte', 'lt', 'lte', 'neq', 'ngt', 'ngte', 'nlt', 'nlte'] as Array<TSearchOperatorNumber>,
    boolean: ['eq', 'neq'] as Array<TSearchOperatorBoolean>,
    date: ['eq', 'gt', 'gte', 'lt', 'lte', 'neq', 'ngt', 'ngte', 'nlt', 'nlte'] as Array<TSearchOperatorDate>,
  },
};
