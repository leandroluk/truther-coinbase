import {type NSearch} from '#/generics/search';

const rangeList = ['in', 'nin'] as Array<NSearch.Operator.Range>;
export const SEARCH = {
  OPERATOR: {
    STRING: [
      'eq', //
      'like',
      'neq',
      'nlike',
      ...rangeList,
    ] as Array<NSearch.Operator.String & NSearch.Operator.Range>,
    NUMBER: [
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
    ] as Array<NSearch.Operator.Number & NSearch.Operator.Range>,
    BOOLEAN: [
      'eq', //
      'neq',
      ...rangeList,
    ] as Array<NSearch.Operator.Boolean & NSearch.Operator.Range>,
    DATE: [
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
    ] as Array<NSearch.Operator.Date & NSearch.Operator.Range>,
  },
};
