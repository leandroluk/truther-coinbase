import {MESSAGE, REGEX} from '#/constants';
import {TUser} from '#/entities';
import {EUserRole} from '#/enums';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TCreateUser = {
  run(data: TCreateUser.Data): Promise<void>;
};
export namespace TCreateUser {
  export type Data = TUser.Fields;
  export namespace Data {
    const userRoleValues = Object.values(EUserRole);
    // prettier-ignore
    export const schema = Joi.object<Data>({
      name: Joi.string().min(1).max(200).required(),
      email: Joi.string().email().max(200).required(),
      password: Joi.string().pattern(REGEX.PASSWORD).messages({'string.pattern.base': MESSAGE.PASSWORD}).required(),
      role: Joi.string().valid(...userRoleValues).default(EUserRole.Member).required(),
    });
    export const swagger = Swagger.object<Data>({
      required: ['email'],
      properties: {
        name: TUser.swagger.properties.name,
        email: TUser.swagger.properties.email,
        password: TUser.swagger.properties.password,
        role: TUser.swagger.properties.role,
      },
    });
  }
}
