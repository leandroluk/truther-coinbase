import {type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TCoin} from './coin';

export type TCoinPrice = TCoinPrice.Entity & TCoinPrice.Fields & TCoinPrice.Relations;
export namespace TCoinPrice {
  export type Entity = TIndexable & TUpdatable;
  export type Fields = {
    /** @type {VARCHAR[100]} */
    marketCap: string;
    /** @type {FLOAT} */
    value: number;
  };
  export type Relations = {
    /** @alias Coin(id) */
    coinId: TCoin['id'];
  };
  export const swagger = Swagger.object<TCoinPrice>({
    description: "CoinPrice's entity",
    required: ['id', 'updatedAt', 'marketCap', 'value', 'coinId'],
    properties: {
      id: Swagger.integer({description: "CoinPrice's identifier"}),
      updatedAt: Swagger.date({description: "CoinPrice's update date"}),
      marketCap: Swagger.string({description: "CoinPrice's market capacity"}),
      value: Swagger.number({description: "CoinPrice's value"}),
      coinId: Swagger.integer({description: "CoinPrice's reference to Coin's identifier"}),
    },
  });
}
