import {Injectable} from '@nestjs/common';
import {TSearchCoin_Query, type TSearchCoin, type TSearchCoin_Result} from '@repo/domain';
import {Validate} from '@repo/nest-common';
import {CoinView, DatabaseService} from '@repo/nest-database';

@Injectable()
export class SearchCoinService implements TSearchCoin {
  constructor(private readonly databaseService: DatabaseService) {}

  @Validate([TSearchCoin_Query.validator])
  async run(query: TSearchCoin_Query): Promise<TSearchCoin_Result> {
    const result = await this.databaseService.search(CoinView, query);
    return result;
  }
}
