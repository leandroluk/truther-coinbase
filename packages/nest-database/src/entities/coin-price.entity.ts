import {FullTextEntity, IndexableColumn, UpdatableColumn} from '#/decorators';
import {type TCoinPrice} from '@repo/domain';
import {Column, JoinColumn, ManyToOne} from 'typeorm';
import {CoinEntity} from './coin.entity';

@FullTextEntity<CoinPriceEntity>({
  name: 'CoinPrice',
  fullTextFields: [
    'id',
    // 'updatedAt',
    'marketCap',
    'value',
    'coinId',
  ],
})
export class CoinPriceEntity implements TCoinPrice {
  @IndexableColumn()
  id!: number;

  @UpdatableColumn()
  updatedAt!: Date;

  @Column({name: 'marketCap', type: 'varchar', length: 100})
  marketCap!: string;

  @Column({name: 'value', type: 'float'})
  value!: number;

  @Column({name: 'coinId', type: 'bigint'})
  coinId!: number;

  //--

  @ManyToOne(() => CoinEntity, _ => _.PriceList, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'coinId', foreignKeyConstraintName: 'id'})
  Coin!: CoinEntity;
}
