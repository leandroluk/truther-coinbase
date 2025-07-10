import {swaggerGenerator} from '#/generators/swagger';
import {type TIndexable, type TUpdatable} from '#/types';
import {type TCoin} from './coin';

export type TCoinPrice = TCoinPrice_Entity & TCoinPrice_Fields & TCoinPrice$Relations;
export type TCoinPrice_Entity = TIndexable & TUpdatable;
export type TCoinPrice_Fields = {
  /** @type {VARCHAR[100]} */
  marketCap: string;
  /** @type {FLOAT} */
  value: number;
};
export type TCoinPrice$Relations = {
  /** @alias Coin(id) */
  coinId: TCoin['id'];
};
export const TCoinPrice = {
  swagger: swaggerGenerator.object<TCoinPrice>({
    description: "CoinPrice's entity",
    required: ['id', 'updatedAt', 'marketCap', 'value', 'coinId'],
    properties: {
      id: swaggerGenerator.integer({description: "CoinPrice's identifier"}),
      updatedAt: swaggerGenerator.date({description: "CoinPrice's update date"}),
      marketCap: swaggerGenerator.string({description: "CoinPrice's market capacity"}),
      value: swaggerGenerator.number({description: "CoinPrice's value"}),
      coinId: swaggerGenerator.integer({description: "CoinPrice's reference to Coin's identifier"}),
    },
  }),
};
