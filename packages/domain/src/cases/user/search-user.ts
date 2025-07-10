import {EUserRole} from '#/enums';
import {swaggerGenerator, validatorGenerator} from '#/generators';
import {TUser} from '#/objects';
import {type TSearchQuery, type TSearchResult} from '#/types';
import Joi from 'joi';

export type TSearchUser = {
  run(query: TSearchUser_Query): Promise<TSearchUser_Result>;
};
export type TSearchUser_Item = Omit<TUser, 'password'>;
export type TSearchUser_Query = TSearchQuery<TUser>;
export type TSearchUser_Result = TSearchResult<TSearchUser_Item>;

const itemSwagger = swaggerGenerator.object<TSearchUser_Item>({
  required: [],
  properties: {
    id: TUser.swagger.properties.id,
    updatedAt: TUser.swagger.properties.updatedAt,
    createdAt: TUser.swagger.properties.createdAt,
    removedAt: TUser.swagger.properties.removedAt,
    name: TUser.swagger.properties.name,
    email: TUser.swagger.properties.email,
    role: TUser.swagger.properties.role,
  },
});

export const TSearchUser_Query = {
  validator: validatorGenerator.searchQuery<TSearchUser_Item>({
    id: Joi.number().integer().positive(),
    updatedAt: Joi.date(),
    createdAt: Joi.date(),
    name: Joi.string(),
    email: Joi.string(),
    role: Joi.string().valid(...Object.values(EUserRole)),
  }),
  swagger: swaggerGenerator.searchQuery<TSearchUser_Item>(itemSwagger),
};

export const TSearchUser_Result = {
  swagger: swaggerGenerator.searchResult<TSearchUser_Item>(itemSwagger),
};
