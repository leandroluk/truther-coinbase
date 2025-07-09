import {type TCreatable, type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TCoin = TCoin.Entity & TCoin.Fields;
export namespace TCoin {
  export type Entity = TIndexable & TUpdatable & TCreatable;
  export type Fields = {
    /** @type {VARCHAR[100]} */
    name: string;
    /** @type {VARCHAR[10]} */
    symbol: string;
    /** @type {URL} */
    thumb: string;
    /** @type {VARCHAR[100]} */
    slug: string;
  };
  export const swagger = Swagger.object<TCoin>({
    description: "Coin's entity",
    required: ['id', 'updatedAt', 'createdAt', 'name', 'symbol', 'thumb', 'slug'],
    properties: {
      id: Swagger.integer({description: "Coin's identifier"}),
      updatedAt: Swagger.date({description: "Coin's update date"}),
      createdAt: Swagger.date({description: "Coin's creation date"}),
      name: Swagger.string({description: "Coin's name"}),
      symbol: Swagger.string({description: "Coin's symbol"}),
      thumb: Swagger.string({description: "Coin's thumb"}),
      slug: Swagger.string({description: "Coin's slug"}),
    },
  });
}
