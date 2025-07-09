import {swaggerGenerator} from '#/generators/swagger';
import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/types';

export type TCoin = TCoin_Entity & TCoin_Fields;
export type TCoin_Entity = TIndexable & TUpdatable & TCreatable & TRemovable;
export type TCoin_Fields = {
  /** @type {VARCHAR[100]} */
  name: string;
  /** @type {VARCHAR[10]} */
  symbol: string;
  /** @type {URL} */
  thumb: string;
  /** @type {VARCHAR[100]} */
  slug: string;
};

export const TCoin = {
  swagger: swaggerGenerator.object<TCoin>({
    description: "Coin's entity",
    required: ['id', 'updatedAt', 'createdAt', 'name', 'symbol', 'thumb', 'slug'],
    properties: {
      id: swaggerGenerator.integer({description: "Coin's identifier"}),
      updatedAt: swaggerGenerator.date({description: "Coin's update date"}),
      createdAt: swaggerGenerator.date({description: "Coin's creation date"}),
      removedAt: swaggerGenerator.date({description: "Coin's removal date"}),
      name: swaggerGenerator.string({description: "Coin's name"}),
      symbol: swaggerGenerator.string({description: "Coin's symbol"}),
      thumb: swaggerGenerator.string({description: "Coin's thumb"}),
      slug: swaggerGenerator.string({description: "Coin's slug"}),
    },
  }),
};
