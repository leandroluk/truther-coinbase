import {swaggerGenerator, validatorGenerator} from '#/generators';
import {TCoin, type TCoinPrice} from '#/objects';
import {type TSearchQuery, type TSearchResult} from '#/types';
import Joi from 'joi';

export type TSearchCoin = {
  run(query: TSearchCoin_Query): Promise<TSearchCoin_Result>;
};
export type TSearchCoin_Item = Omit<TCoin, 'thumb'> & {
  currentPrice: TCoinPrice['value'];
  currentMarketCap: TCoinPrice['marketCap'];
  highestPrice: number;
  lowestPrice: number;
  priceChange24h: number;
  priceChange7d: number;
};
export type TSearchCoin_Query = TSearchQuery<TSearchCoin_Item>;
export type TSearchCoin_Result = TSearchResult<TSearchCoin_Item>;

const itemSwagger = swaggerGenerator.object<TSearchCoin_Item>({
  required: [],
  properties: {
    id: TCoin.swagger.properties.id,
    updatedAt: TCoin.swagger.properties.updatedAt,
    createdAt: TCoin.swagger.properties.createdAt,
    removedAt: TCoin.swagger.properties.removedAt,
    name: TCoin.swagger.properties.name,
    symbol: TCoin.swagger.properties.symbol,
    slug: TCoin.swagger.properties.slug,
    currentPrice: swaggerGenerator.number({description: "CoinPrice's last value"}),
    currentMarketCap: swaggerGenerator.string({description: "CoinPrice's last market cap"}),
    highestPrice: swaggerGenerator.number({description: "CoinPrice's highest value"}),
    lowestPrice: swaggerGenerator.number({description: "CoinPrice's lowest value"}),
    priceChange24h: swaggerGenerator.number({description: "CoinPrice's percentage change over the last 24 hours"}),
    priceChange7d: swaggerGenerator.number({description: "CoinPrice's percentage change over the last 7 days"}),
  },
});

export const TSearchCoin = {
  query: {
    validator: validatorGenerator.searchQuery<TSearchCoin_Item>({
      id: Joi.number().integer().positive(),
      updatedAt: Joi.date(),
      createdAt: Joi.date(),
      name: Joi.string(),
      symbol: Joi.string(),
      slug: Joi.string(),
      currentPrice: Joi.number(),
      currentMarketCap: Joi.string(),
      highestPrice: Joi.number(),
      lowestPrice: Joi.number(),
      priceChange24h: Joi.number(),
      priceChange7d: Joi.number(),
    }),
    swagger: swaggerGenerator.searchResult<TSearchCoin_Item>(itemSwagger),
  },
  result: {
    swagger: swaggerGenerator.searchResult<TSearchCoin_Item>(itemSwagger),
  },
};
