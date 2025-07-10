import {FullTextView} from '#/decorators';
import {type TSearchCoin_Item} from '@repo/domain';
import {ViewColumn} from 'typeorm';

@FullTextView({
  name: 'CoinView',
  fullTextFields: [
    'id', //
    // 'updatedAt',
    // 'createdAt',
    // 'removedAt',
    'name',
    'symbol',
    'slug',
    'currentPrice',
    'currentMarketCap',
    'highestPrice',
    'lowestPrice',
    'priceChange24h',
    'priceChange7d',
  ],
})
export class CoinView implements TSearchCoin_Item {
  @ViewColumn({name: 'id'})
  id!: number;

  @ViewColumn({name: 'updatedAt'})
  updatedAt!: Date;

  @ViewColumn({name: 'createdAt'})
  createdAt!: Date;

  @ViewColumn({name: 'removedAt'})
  removedAt!: Date | null;

  @ViewColumn({name: 'name'})
  name!: string;

  @ViewColumn({name: 'symbol'})
  symbol!: string;

  @ViewColumn({name: 'slug'})
  slug!: string;

  @ViewColumn({name: 'currentPrice'})
  currentPrice!: number;

  @ViewColumn({name: 'currentMarketCap'})
  currentMarketCap!: number;

  @ViewColumn({name: 'highestPrice'})
  highestPrice!: number;

  @ViewColumn({name: 'lowestPrice'})
  lowestPrice!: number;

  @ViewColumn({name: 'priceChange24h'})
  priceChange24h!: number;

  @ViewColumn({name: 'priceChange7d'})
  priceChange7d!: number;
}
