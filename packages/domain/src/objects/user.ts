import {EUserRole} from '#/enums';
import {swaggerGenerator} from '#/generators/swagger';
import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/types';

export type TUser = TUser_Entity & TUser_Fields;
export type TUser_Entity = TIndexable & TUpdatable & TCreatable & TRemovable;
export type TUser_Fields = {
  /** @type {VARCHAR[100]} */
  name: string;
  /** @type {VARCHAR[100]} */
  email: string;
  /** @type {TEXT} */
  password: string;
  /** @type {ENUM[admin,member]} */
  role: EUserRole;
};

export const TUser = {
  swagger: swaggerGenerator.object<TUser>({
    description: "User's entity",
    required: ['id', 'updatedAt', 'createdAt', 'email', 'role'],
    properties: {
      id: swaggerGenerator.integer({description: "User's identifier"}),
      updatedAt: swaggerGenerator.date({description: "User's update date"}),
      createdAt: swaggerGenerator.date({description: "User's creation date"}),
      removedAt: swaggerGenerator.date({description: "User's removal date"}),
      name: swaggerGenerator.string({description: "User's name"}),
      email: swaggerGenerator.string({description: "User's email"}),
      password: swaggerGenerator.string({description: "User's password"}),
      role: swaggerGenerator.enum({description: "User's role", enum: Object.values(EUserRole)}),
    },
  }),
};
