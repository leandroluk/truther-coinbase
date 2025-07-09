import {TCoin, type TCoinPrice} from '#/entities';
import {type NSearch} from '#/generics';
import {Swagger} from '#/swagger';
import {search} from '#/utils';
import Joi from 'joi';

export type TSearchCoin = {
  run(data: TSearchCoin.Data): Promise<TSearchCoin.Result>;
};
export namespace TSearchCoin {
  export type Data = NSearch.Query<Data.Item>;
  export namespace Data {
    export type Item = TCoin & {
      currentPrice: TCoinPrice['value'];
      currentMarketCap: TCoinPrice['marketCap'];
      highestPrice: number;
      lowestPrice: number;
      priceChange24h: number;
      priceChange7d: number;
    };
    export namespace Item {
      export const schema = Joi.object<Item>({
        id: Joi.number().integer().positive(),
        updatedAt: Joi.date(),
        createdAt: Joi.date(),
        name: Joi.string(),
        symbol: Joi.string(),
        thumb: Joi.string(),
        slug: Joi.string(),
        currentPrice: Joi.number(),
        currentMarketCap: Joi.string(),
        highestPrice: Joi.number(),
        lowestPrice: Joi.number(),
        priceChange24h: Joi.number(),
        priceChange7d: Joi.number(),
      });
      export const swagger = Swagger.object<Item>({
        required: [],
        properties: {
          id: TCoin.swagger.properties.id,
          updatedAt: TCoin.swagger.properties.updatedAt,
          createdAt: TCoin.swagger.properties.createdAt,
          name: TCoin.swagger.properties.name,
          symbol: TCoin.swagger.properties.symbol,
          thumb: TCoin.swagger.properties.thumb,
          slug: TCoin.swagger.properties.slug,
          currentPrice: Swagger.number({description: "CoinPrice's last value"}),
          currentMarketCap: Swagger.string({description: "CoinPrice's last market cap"}),
          highestPrice: Swagger.number({description: "CoinPrice's highest value"}),
          lowestPrice: Swagger.number({description: "CoinPrice's lowest value"}),
          priceChange24h: Swagger.number({description: "CoinPrice's percentage change over the last 24 hours"}),
          priceChange7d: Swagger.number({description: "CoinPrice's percentage change over the last 7 days"}),
        },
      });
    }
    export const {schema, swagger} = search.querySchemaAndSwagger(Item.schema, Item.swagger);
  }
  export type Result = NSearch.Result<Result.Item>;
  export namespace Result {
    export type Item = Data.Item;
    export namespace Item {
      export const swagger = Data.Item.swagger;
    }
    export const swagger = search.resultSwagger<Item>(Item.swagger);
  }
}
