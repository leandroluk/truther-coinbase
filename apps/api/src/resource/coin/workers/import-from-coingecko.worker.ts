import {Injectable} from '@nestjs/common';
import {TCoin, TCoinPrice} from '@repo/domain';
import {CoingeckoApiService} from '@repo/nest-coingecko-api';
import {Retry} from '@repo/nest-common';
import {CoinEntity, CoinPriceEntity, DatabaseService} from '@repo/nest-database';
import {LoggerService} from '@repo/nest-logger';
import dateFns from 'date-fns';
import {EntityManager, In} from 'typeorm';

type CoinList = Awaited<ReturnType<CoingeckoApiService['coinsMarkets']>>;

@Injectable()
export class ImportFromCoingeckoWorker {
  private alreadyRunning = false;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly coingeckoApiService: CoingeckoApiService,
    private readonly databaseService: DatabaseService
  ) {}

  private async ensureCoinPricePartitions(entityManager: EntityManager, coinList: CoinList): Promise<void> {
    const dateList = coinList
      .filter(coinItem => coinItem.last_updated)
      .map(coinItem => dateFns.format(coinItem.last_updated, 'yyyy-MM-01'));
    const noDuplicatesList = [...new Set(dateList)];
    await entityManager.query('SELECT "CoinPriceEnsurePartition"($1)', [noDuplicatesList]);
  }

  private async segregate(
    entityManager: EntityManager,
    coinList: CoinList
  ): Promise<{
    existingList: TCoin[];
    toUpdateList: CoinList;
    toInsertList: CoinList;
  }> {
    const existingList = await entityManager.find(CoinEntity, {
      where: {slug: In(coinList.map(item => item.id))},
      select: {id: true, slug: true},
    });
    const [toInsertList, toUpdateList] = coinList.reduce(
      (tuple, coin) => {
        tuple[Number(existingList.some(existing => existing.slug === coin.id))]!.push(coin);
        return tuple;
      },
      [[] as CoinList, [] as CoinList]
    );
    return {existingList, toUpdateList, toInsertList};
  }

  private async insertCoinList(entityManager: EntityManager, toInsertList: CoinList): Promise<void> {
    if (toInsertList.length) {
      this.loggerService.log(`inserting ${toInsertList.length} coin's`);
      await entityManager.save(
        toInsertList.map(coinItem =>
          entityManager.create(CoinEntity, {
            name: coinItem.name,
            symbol: coinItem.symbol,
            image: coinItem.image,
            slug: coinItem.id,
            PriceList: [{marketCap: coinItem.market_cap || 0, value: coinItem.current_price || 0}],
          })
        )
      );
    }
  }

  private async updateCoinList(
    entityManager: EntityManager,
    existingList: TCoin[],
    toUpdateList: CoinList
  ): Promise<void> {
    if (toUpdateList.length) {
      this.loggerService.log(`updating ${toUpdateList.length} coin's`);
      const coinIdList = existingList.map(coin => coin.id);
      const latestCoinPriceList = await entityManager
        .createQueryBuilder(CoinPriceEntity, 'cp')
        .distinctOn(['cp.coinId'])
        .where('cp.coinId IN (:...coinIdList)', {coinIdList})
        .orderBy('cp.coinId', 'ASC')
        .addOrderBy('cp.updatedAt', 'DESC')
        .getMany();
      const existingCoinMap = existingList.reduce(
        (obj, item) => ({...obj, [item.slug]: item.id}),
        {} as Record<TCoin['slug'], TCoin['id']>
      );
      const coinPriceMap = latestCoinPriceList.reduce(
        (obj, item) => ({...obj, [item.coinId]: item.value}),
        {} as Record<TCoinPrice['coinId'], TCoinPrice['value']>
      );
      const coinPriceEntityList = toUpdateList
        .filter(item => coinPriceMap[existingCoinMap[item.id]!] !== item.current_price)
        .map(item => {
          return entityManager.create(CoinPriceEntity, {
            updatedAt: item.last_updated ? new Date(item.last_updated) : new Date(),
            marketCap: item.market_cap || 0,
            value: item.current_price || 0,
            coinId: existingCoinMap[item.id]!,
          });
        });

      await entityManager
        .createQueryBuilder()
        .insert()
        .into(CoinPriceEntity)
        .values(coinPriceEntityList)
        .orIgnore() // <- ignore existing unique key (coinId + updatedAt)
        .execute();
    }
  }

  @Retry(3, 1000 * 60 /* 1 minute delay */)
  async run(): Promise<void> {
    if (this.alreadyRunning) {
      return;
    }
    this.alreadyRunning = true;
    try {
      this.loggerService.log('started');
      let page = 0;
      while (true) {
        this.loggerService.log(`getting page ${page}`);
        const coinList = await this.coingeckoApiService.coinsMarkets(page);
        if (coinList.length === 0) {
          this.loggerService.log('done');
          break;
        }
        await this.databaseService.transaction(async entityManager => {
          try {
            await this.ensureCoinPricePartitions(entityManager, coinList);
            const {existingList, toInsertList, toUpdateList} = await this.segregate(entityManager, coinList);
            await this.insertCoinList(entityManager, toInsertList);
            await this.updateCoinList(entityManager, existingList, toUpdateList);
          } catch (error) {
            console.log(error);
            throw error;
          }
        });
        page++;
        // need this to no explode Rate Limit of free tier (30 per minute)
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } finally {
      this.alreadyRunning = false;
    }
  }
}
