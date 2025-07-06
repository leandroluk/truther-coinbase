import {SEARCH} from '#/constants';
import {type NSearch} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export const search = {
  queryWhereSchemaAndSwagger<T extends object>(
    schema: Joi.ObjectSchema<T>,
    swagger: Swagger.ObjectType<T>
  ): {
    schema: Joi.ObjectSchema<NSearch.Query.Where<T>>;
    swagger: Swagger.ObjectType<NSearch.Query.Where<T>>;
  } {
    const schemaProperties: Joi.PartialSchemaMap<any> = {};
    const swaggerProperties = {} as any;
    for (const [key, property] of Object.entries(swagger.properties)) {
      const baseType = property as Swagger.BaseType;
      const type = (baseType['x-type'] || baseType.type!).toUpperCase() as keyof typeof SEARCH.OPERATOR;
      const operators: Array<string> = SEARCH.OPERATOR[type];
      schemaProperties[key] = Joi.object({
        ...operators.reduce((obj, operator) => ({...obj, [operator]: schema.extract(key).optional()}), {}),
        in: Joi.array().items(schema.extract(key).required()).min(1).optional(),
        nin: Joi.array().items(schema.extract(key).required()).min(1).optional(),
      }).optional();
      swaggerProperties[key] = Swagger.object({
        required: [],
        properties: operators.reduce((obj, operator) => ({...obj, [operator]: property}), {}),
      });
    }
    return {
      schema: Joi.object<NSearch.Query.Where<T>>(schemaProperties),
      swagger: Swagger.object<NSearch.Query.Where<T>>({
        required: [],
        properties: swaggerProperties as Swagger.ObjectType<NSearch.Query.Where<T>>['properties'],
      }),
    };
  },

  queryFieldsSchemaAndSwagger<T extends object>(
    swagger: Swagger.ObjectType<T>
  ): {
    schema: Joi.ObjectSchema<NSearch.Query.Fields<T>>;
    swagger: Swagger.ObjectType<Required<NSearch.Query.Fields<T>>>;
  } {
    const keys = Object.keys(swagger.properties);
    const keySchema = Joi.string().valid(...keys);
    const property = Swagger.array({items: Swagger.enum({enum: keys})});
    return {
      schema: Joi.object({
        select: Joi.array().items(keySchema).min(1).unique(),
        remove: Joi.array().items(keySchema).min(1).unique(),
      }).xor('select', 'remove'),
      swagger: Swagger.object<Required<NSearch.Query.Fields<T>>>({
        required: [],
        properties: {
          select: property,
          remove: property,
        },
      }),
    };
  },

  querySortSchemaAndSwagger<T extends object>(
    swagger: Swagger.ObjectType<T>
  ): {
    schema: Joi.ObjectSchema<NSearch.Query.Sort<T>>;
    swagger: Swagger.ObjectType<NSearch.Query.Sort<T>>;
  } {
    const keys = Object.keys(swagger.properties);
    return {
      schema: Joi.object<NSearch.Query.Sort<T>>(
        keys.reduce(
          (map, key) => {
            map[key] = Joi.number().integer().valid(-1, 1);
            return map;
          },
          {} as Record<string, Joi.Schema>
        )
      ),
      swagger: Swagger.object<NSearch.Query.Sort<T>>({
        required: [],
        properties: keys.reduce(
          (obj, key) => ({...obj, [key]: Swagger.enum({enum: [-1, 1]})}),
          {} as Swagger.ObjectType<NSearch.Query.Sort<T>>['properties']
        ),
      }),
    };
  },

  querySchemaAndSwagger<T extends object>(
    schema: Joi.ObjectSchema<T>,
    swagger: Swagger.ObjectType<T>
  ): {
    schema: Joi.ObjectSchema<NSearch.Query<T>>;
    swagger: Swagger.ObjectType<NSearch.Query<T>>;
  } {
    const where = search.queryWhereSchemaAndSwagger<T>(schema, swagger);
    const fields = search.queryFieldsSchemaAndSwagger<T>(swagger);
    const sort = search.querySortSchemaAndSwagger<T>(swagger);
    return {
      schema: Joi.object<NSearch.Query<T>>({
        text: Joi.string(),
        where: where.schema,
        fields: fields.schema,
        sort: sort.schema,
        offset: Joi.number().positive().min(0).default(0),
        limit: Joi.number().min(1).positive().default(50),
      }).required(),
      swagger: Swagger.object<NSearch.Query<T>>({
        required: [],
        properties: {
          where: where.swagger,
          fields: fields.swagger,
          sort: sort.swagger,
          text: Swagger.string({description: 'Full text search on available item properties'}),
          limit: Swagger.number({description: 'number of items in page'}),
          offset: Swagger.number({description: 'offset of page'}),
        } as unknown as Swagger.ObjectType<NSearch.Query<T>>['properties'],
      }),
    };
  },

  resultSwagger<T extends object>(
    swagger: Swagger.ObjectType<T> //
  ): Swagger.ObjectType<NSearch.Result<T>> {
    return Swagger.object<NSearch.Result<T>>({
      required: ['items', 'limit', 'offset', 'total'],
      properties: {
        items: Swagger.array<T>({
          description: 'List of entities resulted on request',
          items: swagger as Swagger.ArrayType<T>['items'],
        }),
        limit: Swagger.number({description: 'number of items in page'}),
        offset: Swagger.number({description: 'offset of page'}),
        total: Swagger.number({description: 'Total of results'}),
      },
    });
  },
};
