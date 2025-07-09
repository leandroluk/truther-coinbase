import {
  type TSearchOperatorBoolean,
  type TSearchOperatorDate,
  type TSearchOperatorNumber,
  type TSearchOperatorRange,
  type TSearchOperatorString,
} from '#/types';

const rangeList = ['in', 'nin'] as Array<TSearchOperatorRange>;
export const SEARCH = {
  OPERATOR: {
    string: [
      'eq', //
      'like',
      'neq',
      'nlike',
      ...rangeList,
    ] as Array<TSearchOperatorString & TSearchOperatorRange>,
    number: [
      'eq', //
      'gt',
      'gte',
      'lt',
      'lte',
      'neq',
      'ngt',
      'ngte',
      'nlt',
      'nlte',
      ...rangeList,
    ] as Array<TSearchOperatorNumber & TSearchOperatorRange>,
    boolean: [
      'eq', //
      'neq',
      ...rangeList,
    ] as Array<TSearchOperatorBoolean & TSearchOperatorRange>,
    date: [
      'eq', //
      'gt',
      'gte',
      'lt',
      'lte',
      'neq',
      'ngt',
      'ngte',
      'nlt',
      'nlte',
      ...rangeList,
    ] as Array<TSearchOperatorDate & TSearchOperatorRange>,
  },
};
