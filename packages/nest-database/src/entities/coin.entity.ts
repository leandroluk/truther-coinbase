import {CreatableColumn, FullTextEntity, IndexableColumn, RemovableColumn, UpdatableColumn} from '#/decorators';
import {TCoin} from '@repo/domain';
import {Column, OneToMany} from 'typeorm';
import {CoinPriceEntity} from './coin-price.entity';

@FullTextEntity<CoinEntity>({
  name: 'Coin',
  fullTextFields: [
    'id', //
    // 'updatedAt',
    // 'createdAt',
    // 'removedAt',
    'name',
    'symbol',
    // 'image',
    'slug',
  ],
})
export class CoinEntity implements TCoin {
  @IndexableColumn()
  id!: number;

  @UpdatableColumn()
  updatedAt!: Date;

  @CreatableColumn()
  createdAt!: Date;

  @RemovableColumn()
  removedAt!: Date | null;

  @Column({name: 'name', type: 'varchar', length: 100})
  name!: string;

  @Column({name: 'symbol', type: 'varchar', length: 10})
  symbol!: string;

  @Column({name: 'image', type: 'text'})
  image!: string;

  @Column({name: 'slug', type: 'varchar', length: 100})
  slug!: string;

  //--

  @OneToMany(() => CoinPriceEntity, _ => _.Coin)
  PriceList!: CoinPriceEntity[];
}
