import {MESSAGE, REGEX} from '#/constants';
import {EUserRole} from '#/enums';
import {swaggerGenerator} from '#/generators/swagger';
import {TUser, type TUser_Fields} from '#/objects';
import Joi from 'joi';

export type TUpdateUserProfile = {
  run(data: TUpdateUserProfile_Data): Promise<void>;
};
export type TUpdateUserProfile_Data = Pick<TUser, 'id'> & {
  changes: Partial<TUser_Fields>;
};
export const TUpdateUserProfile_Data = {
  validator: Joi.object<TUpdateUserProfile_Data>({
    id: Joi.number().integer().positive().required(),
    // prettier-ignore
    changes: Joi.object<TUpdateUserProfile_Data['changes']>({
      name: Joi.string().min(1).max(200).optional(),
      email: Joi.string().email().max(200).optional(),
      password: Joi.string().pattern(REGEX.PASSWORD).messages({'string.pattern.base': MESSAGE.PASSWORD}).optional(),
      role: Joi.string().valid(...Object.values(EUserRole)).default(EUserRole.Member).optional(),
    }),
  }),
  swagger: swaggerGenerator.object<TUpdateUserProfile_Data>({
    required: ['id', 'changes'],
    properties: {
      id: TUser.swagger.properties.id,
      changes: swaggerGenerator.object<TUpdateUserProfile_Data['changes']>({
        required: [],
        properties: {
          name: TUser.swagger.properties.name,
          email: TUser.swagger.properties.email,
          password: TUser.swagger.properties.password,
          role: TUser.swagger.properties.role,
        },
      }),
    },
  }),
};
