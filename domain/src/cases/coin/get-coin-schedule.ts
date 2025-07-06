import {TCoin} from '#/entities';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TGetCoinSchedule = {
  run(data: TGetCoinSchedule.Data): Promise<void>;
};
export namespace TGetCoinSchedule {
  export type Data = Pick<TCoin, 'slug'>;
  export namespace Data {
    export const schema = Joi.object<Data>({
      slug: Joi.string().required(),
    });
    export const swagger = Swagger.object<Data>({
      required: ['slug'],
      properties: {
        slug: TCoin.swagger.properties.slug,
      },
    });
  }
}
