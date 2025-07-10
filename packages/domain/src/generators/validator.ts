import {SEARCH} from '#/constants';
import {type TSearchFields, type TSearchQuery, type TSearchSort, type TSearchWhere} from '#/types';
import Joi from 'joi';

type SchemaMap<T extends object> = {[K in keyof T]?: Joi.AnySchema};

export const validatorGenerator = {
  searchWhere: <T extends object>(schemaMap: SchemaMap<T>): Joi.ObjectSchema<TSearchWhere<T>> => {
    return Joi.object<TSearchWhere<T>>(
      (Object.keys(schemaMap) as Array<string & keyof T>).reduce(
        (obj, key) => ({
          ...obj,
          [key]: Joi.object({
            ...Object.keys(SEARCH.OPERATOR[schemaMap[key]!.type as keyof typeof SEARCH.OPERATOR]).reduce(
              (obj, operator) => ({
                [operator]: schemaMap[key]!.optional(),
              }),
              {}
            ),
            in: Joi.array().items(schemaMap[key]!.required()).min(1).optional(),
            nin: Joi.array().items(schemaMap[key]!.required()).min(1).optional(),
          }),
        }),
        {}
      )
    );
  },

  searchFields: <T extends object>(schemaMap: SchemaMap<T>): Joi.ObjectSchema<TSearchFields<T>> => {
    const keys = Object.keys(schemaMap);
    const keySchema = Joi.string().valid(...keys);
    return Joi.object({
      select: Joi.array().items(keySchema).min(1).unique(),
      remove: Joi.array().items(keySchema).min(1).unique(),
    }).xor('select', 'remove');
  },

  searchSort: <T extends object>(schemaMap: SchemaMap<T>): Joi.ObjectSchema<TSearchSort<T>> => {
    const keys = Object.keys(schemaMap);
    return Joi.object<TSearchSort<T>>(
      keys.reduce(
        (map, key) => {
          map[key] = Joi.number().integer().valid(-1, 1);
          return map;
        },
        {} as Record<string, Joi.Schema>
      )
    );
  },

  searchQuery: <T extends object>(schemaMap: SchemaMap<T>): Joi.ObjectSchema<TSearchQuery<T>> => {
    return Joi.object<TSearchQuery<T>>({
      text: Joi.string(),
      where: validatorGenerator.searchWhere<T>(schemaMap),
      fields: validatorGenerator.searchFields<T>(schemaMap),
      sort: validatorGenerator.searchSort<T>(schemaMap),
      offset: Joi.number().positive().min(0).default(0),
      limit: Joi.number().min(1).positive().default(50),
    }).required();
  },
};
