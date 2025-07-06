import {TUser} from '#/entities';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TLoginAuth = {
  run(data: TLoginAuth.Data): Promise<TLoginAuth.Result>;
};
export namespace TLoginAuth {
  export type Data = Pick<TUser, 'email' | 'password'>;
  export namespace Data {
    export const schema = Joi.object<Data>({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    export const swagger = Swagger.object<Data>({
      required: ['email', 'password'],
      properties: {
        email: TUser.swagger.properties.email,
        password: TUser.swagger.properties.password,
      },
      example: {
        email: 'john.doe@email.com',
        password: 'Test@123',
      } satisfies Data,
    });
  }
  export type Result = {
    sessionId: string;
  };
  export namespace Result {
    export const swagger = Swagger.object<Result>({
      required: ['sessionId'],
      properties: {
        sessionId: Swagger.string({description: "User's authenticated session"}),
      },
    });
  }
}
