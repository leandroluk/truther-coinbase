import {SEARCH} from '#/constants';
import {
  type SwaggerArray,
  type SwaggerBase,
  type SwaggerEnum,
  type SwaggerObject,
  type SwaggerProperties,
  type TSearchFields,
  type TSearchQuery,
  type TSearchResult,
  type TSearchSort,
  type TSearchWhere,
} from '#/types';

export const swaggerGenerator = {
  object: <T extends object>(data?: Partial<Omit<SwaggerObject<T>, 'type'>>): SwaggerObject<T> => ({
    type: 'object',
    required: data?.required ?? [],
    properties: (data?.properties ?? {}) as {[K in keyof T]: SwaggerProperties<T[K]>},
  }),

  array: <T = unknown>(data?: Omit<SwaggerArray<T>, 'type'>): SwaggerArray<T> => ({
    type: 'array',
    items: (data?.items ?? {}) as SwaggerArray<T>['items'],
    ...data,
  }),

  boolean: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'boolean',
    ...data,
  }),

  number: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'number',
    ...data,
  }),

  integer: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'integer',
    'x-type': 'number',
    ...data,
  }),

  string: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'string',
    ...data,
  }),

  url: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'string',
    format: 'url',
    ...data,
  }),

  enum: <T>(data?: Omit<SwaggerEnum<T>, 'type'>): SwaggerEnum<T> => ({
    type: 'string',
    enum: data?.enum ?? [],
    ...data,
  }),

  email: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'string',
    format: 'email',
    ...data,
  }),

  binary: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'string',
    format: 'binary',
    ...data,
  }),

  date: (data?: Omit<SwaggerBase, 'type'>): SwaggerBase => ({
    type: 'string',
    'x-type': 'date',
    format: 'date-time',
    ...data,
  }),

  searchWhere: <T extends object>(swaggerObject: SwaggerObject<T>): SwaggerObject<TSearchWhere<T>> => {
    const swaggerProperties = {} as any;
    for (const [key, property] of Object.entries(swaggerObject.properties)) {
      const baseType = property as SwaggerBase;
      const type = (baseType['x-type'] || baseType.type) as keyof typeof SEARCH.OPERATOR;
      const operators = SEARCH.OPERATOR[type] as Array<string>;
      swaggerProperties[key] = swaggerGenerator.object({
        required: [],
        properties: operators.reduce((obj, operator) => ({...obj, [operator]: property}), {}),
      });
    }
    return swaggerGenerator.object<TSearchWhere<T>>({
      required: [],
      properties: swaggerProperties as SwaggerObject<TSearchWhere<T>>['properties'],
    });
  },

  searchFields<T extends object>(objectSwagger: SwaggerObject<T>): SwaggerObject<Required<TSearchFields<T>>> {
    const keys = Object.keys(objectSwagger.properties);
    const property = swaggerGenerator.array({items: swaggerGenerator.enum({enum: keys})});
    return swaggerGenerator.object<Required<TSearchFields<T>>>({
      required: [],
      properties: {
        select: property,
        remove: property,
      },
    });
  },

  searchSort<T extends object>(swaggerObject: SwaggerObject<T>): SwaggerObject<TSearchSort<T>> {
    const keys = Object.keys(swaggerObject.properties);
    return swaggerGenerator.object<TSearchSort<T>>({
      required: [],
      properties: keys.reduce(
        (obj, key) => ({...obj, [key]: swaggerGenerator.enum({enum: [-1, 1]})}),
        {} as SwaggerObject<TSearchSort<T>>['properties']
      ),
    });
  },

  searchQuery<T extends object>(swaggerObject: SwaggerObject<T>): SwaggerObject<TSearchQuery<T>> {
    return swaggerGenerator.object<TSearchQuery<T>>({
      required: [],
      properties: {
        where: swaggerGenerator.searchWhere<T>(swaggerObject),
        fields: swaggerGenerator.searchFields<T>(swaggerObject),
        sort: swaggerGenerator.searchSort<T>(swaggerObject),
        text: swaggerGenerator.string({description: 'Full text search on available item properties'}),
        limit: swaggerGenerator.number({description: 'number of items in page'}),
        offset: swaggerGenerator.number({description: 'offset of page'}),
      } as unknown as SwaggerObject<TSearchQuery<T>>['properties'],
    });
  },

  searchResult<T extends object>(swaggerObject: SwaggerObject<T>): SwaggerObject<TSearchResult<T>> {
    return swaggerGenerator.object<TSearchResult<T>>({
      required: ['items', 'limit', 'offset', 'total'],
      properties: {
        items: swaggerGenerator.array<T>({
          description: 'List of entities resulted on request',
          items: swaggerObject as SwaggerArray<T>['items'],
        }),
        limit: swaggerGenerator.number({description: 'number of items in page'}),
        offset: swaggerGenerator.number({description: 'offset of page'}),
        total: swaggerGenerator.number({description: 'Total of results'}),
      },
    });
  },
};
