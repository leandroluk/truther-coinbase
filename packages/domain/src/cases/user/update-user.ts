import {MESSAGE, REGEX} from '#/constants';
import {TUser} from '#/entities';
import {EUserRole} from '#/enums';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TUpdateUserProfile = {
  run(data: TUpdateUserProfile.Data): Promise<void>;
};
export namespace TUpdateUserProfile {
  export type Data = Pick<TUser, 'id'> & {
    changes: Data.Changes;
  };
  export namespace Data {
    export type Changes = Partial<TUser.Fields>;
    export namespace Changes {
      const userRoleValues = Object.values(EUserRole);
      // prettier-ignore
      export const schema = Joi.object<Changes>({
        name: Joi.string().min(1).max(200).optional(),
        email: Joi.string().email().max(200).optional(),
        password: Joi.string().pattern(REGEX.PASSWORD).messages({'string.pattern.base': MESSAGE.PASSWORD}).optional(),
        role: Joi.string().valid(...userRoleValues).default(EUserRole.Member).optional(),
      });
      export const swagger = Swagger.object<Changes>({
        required: [],
        properties: {
          name: TUser.swagger.properties.name,
          email: TUser.swagger.properties.email,
          password: TUser.swagger.properties.password,
          role: TUser.swagger.properties.role,
        },
      });
    }
    export const schema = Joi.object<Data>({
      id: Joi.number().integer().positive().required(),
    });
    export const swagger = Swagger.object<Data>({
      required: ['id', 'changes'],
      properties: {
        id: TUser.swagger.properties.id,
        changes: Changes.swagger,
      },
    });
  }
}
