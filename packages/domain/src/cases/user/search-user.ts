import {TUser} from '#/entities';
import {EUserRole} from '#/enums';
import {type NSearch} from '#/generics';
import {Swagger} from '#/swagger';
import {search} from '#/utils';
import Joi from 'joi';

export type TSearchUser = {
  run(data: TSearchUser.Data): Promise<TSearchUser.Result>;
};
export namespace TSearchUser {
  export type Data = NSearch.Query<Data.Item>;
  export namespace Data {
    export type Item = Omit<TUser, 'password'>;
    export namespace Item {
      export const schema = Joi.object<Item>({
        id: Joi.number().integer().positive(),
        updatedAt: Joi.date(),
        createdAt: Joi.date(),
        name: Joi.string(),
        email: Joi.string(),
        role: Joi.string().valid(...Object.values(EUserRole)),
      });
      export const swagger = Swagger.object<Item>({
        required: [],
        properties: {
          id: TUser.swagger.properties.id,
          updatedAt: TUser.swagger.properties.updatedAt,
          createdAt: TUser.swagger.properties.createdAt,
          name: TUser.swagger.properties.name,
          email: TUser.swagger.properties.email,
          role: TUser.swagger.properties.role,
        },
      });
    }
    export const {schema, swagger} = search.querySchemaAndSwagger(Item.schema, Item.swagger);
  }
  export type Result = NSearch.Result<Result.Item>;
  export namespace Result {
    export type Item = Data.Item;
    export namespace Item {
      export const swagger = Data.Item.swagger;
    }
    export const swagger = search.resultSwagger<Item>(Item.swagger);
  }
}
