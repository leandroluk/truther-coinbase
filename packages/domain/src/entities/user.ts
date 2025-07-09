import {EUserRole} from '#/enums';
import {type TCreatable, type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TUser = TUser.Entity & TUser.Fields;
export namespace TUser {
  export type Entity = TIndexable & TUpdatable & TCreatable;
  export type Fields = {
    /** @type {VARCHAR[100]} */
    name: string;
    /** @type {VARCHAR[100]} */
    email: string;
    /** @type {TEXT} */
    password: string;
    /** @type {ENUM[admin,member]} */
    role: EUserRole;
  };
  export const swagger = Swagger.object<TUser>({
    description: "User's entity",
    required: ['id', 'updatedAt', 'createdAt', 'email', 'role'],
    properties: {
      id: Swagger.integer({description: "User's identifier"}),
      updatedAt: Swagger.date({description: "User's update date"}),
      createdAt: Swagger.date({description: "User's creation date"}),
      name: Swagger.string({description: "User's name"}),
      email: Swagger.string({description: "User's email"}),
      password: Swagger.string({description: "User's password"}),
      role: Swagger.enum({description: "User's role", enum: Object.values(EUserRole)}),
    },
  });
}
