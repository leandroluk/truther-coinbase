import {FullTextEntity} from '#/decorators';
import {type TCoinPrice} from '@repo/domain';
import {Column, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
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
  @PrimaryGeneratedColumn({type: 'bigint', name: 'id'})
  id!: number;

  @PrimaryColumn({type: 'timestamptz', name: 'updatedAt'})
  updatedAt!: Date;

  @Column({name: 'marketCap', type: 'float'})
  marketCap!: number;

  @Column({name: 'value', type: 'float'})
  value!: number;

  @Column({name: 'coinId', type: 'bigint'})
  coinId!: number;

  //--

  @ManyToOne(() => CoinEntity, coin => coin.PriceList, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'coinId', foreignKeyConstraintName: 'id'})
  Coin!: CoinEntity;
}
