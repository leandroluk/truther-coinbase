import {swaggerGenerator} from '#/generators';
import {TOpenidToken, TUser} from '#/objects';

export type TLoginAuthCredential = {
  run(data: TLoginAuthCredential_Data): Promise<TLoginAuthCredential_Result>;
};
export type TLoginAuthCredential_Data = Pick<TUser, 'email' | 'password'>;
export type TLoginAuthCredential_Result = TOpenidToken & {};
export const TLoginAuthCredential_Data = {
  swagger: swaggerGenerator.object<TLoginAuthCredential_Data>({
    required: ['email', 'password'],
    properties: {
      email: TUser.swagger.properties.email,
      password: TUser.swagger.properties.password,
    },
  }),
};
export const TLoginAuthCredential_Result = {
  swagger: TOpenidToken.swagger,
};
