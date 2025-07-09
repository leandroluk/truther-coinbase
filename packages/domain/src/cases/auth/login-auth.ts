import {swaggerGenerator} from '#/generators';
import {TOpenidToken, TUser} from '#/objects';
import Joi from 'joi';

export type TLoginAuth = {
  run(data: TLoginAuth_Data): Promise<TOpenidToken>;
};
export type TLoginAuth_Data = Pick<TUser, 'email' | 'password'>;

export const TLoginAuth = {
  data: {
    validator: Joi.object<TLoginAuth_Data>({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
    swagger: swaggerGenerator.object<TLoginAuth_Data>({
      required: ['email', 'password'],
      properties: {
        email: TUser.swagger.properties.email,
        password: TUser.swagger.properties.password,
      },
      example: {
        email: 'john.doe@email.com',
        password: 'Test@123',
      } satisfies TLoginAuth_Data,
    }),
  },
  result: TOpenidToken,
};
