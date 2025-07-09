import {MESSAGE, REGEX} from '#/constants';
import {EUserRole} from '#/enums';
import {swaggerGenerator} from '#/generators/swagger';
import {type TUser_Fields, TUser} from '#/objects';
import Joi from 'joi';

export type TCreateUser = {
  run(data: TCreateUser_Data): Promise<void>;
};
export type TCreateUser_Data = TUser_Fields & {};
export const TCreateUser = {
  data: {
    // prettier-ignore
    validator: Joi.object<TUser_Fields>({
      name: Joi.string().min(1).max(200).required(),
      email: Joi.string().email().max(200).required(),
      password: Joi.string().pattern(REGEX.PASSWORD).messages({'string.pattern.base': MESSAGE.PASSWORD}).required(),
      role: Joi.string().valid(...Object.values(EUserRole)).default(EUserRole.Member).required(),
    }),
    swagger: swaggerGenerator.object<TUser_Fields>({
      required: ['email'],
      properties: {
        name: TUser.swagger.properties.name,
        email: TUser.swagger.properties.email,
        password: TUser.swagger.properties.password,
        role: TUser.swagger.properties.role,
      },
    }),
  },
};
