import {Injectable} from '@nestjs/common';
import {Retry} from '@repo/nest-common';
import {LoggerService} from '@repo/nest-logger';
import axios, {Axios} from 'axios';
import {CoingeckoApiEnv} from './coingecko-api.env';

type CoinsListWithMarketData = Array<{
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  last_updated: string;
  high_24h: number;
  low_24h: number;
}>;

@Injectable()
export class CoingeckoApiService {
  private readonly axiosInstance: Axios;

  constructor(
    private readonly coingeckoApiEnv: CoingeckoApiEnv,
    private readonly loggerService: LoggerService
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.coingeckoApiEnv.PACKAGES_NEST_COINGECKO_API_BASE_URL,
      headers: {
        [this.coingeckoApiEnv.PACKAGES_NEST_COINGECKO_API_HEADER]: this.coingeckoApiEnv.PACKAGES_NEST_COINGECKO_API_KEY,
      },
    });
  }

  /** @see https://docs.coingecko.com/v3.0.1/reference/ping-server */
  @Retry(3)
  async ping(): Promise<void> {
    try {
      await this.axiosInstance.get('/ping');
    } catch (error: any) {
      this.loggerService.error(`Failed to ping. ${error.message}`);
      throw error;
    }
  }

  /** @see https://docs.coingecko.com/v3.0.1/reference/coins-markets */
  @Retry(3)
  async coinsMarkets(page = 1): Promise<CoinsListWithMarketData> {
    try {
      const result = await this.axiosInstance.get<CoinsListWithMarketData>('/coins/markets', {
        params: {
          vs_currency: this.coingeckoApiEnv.PACKAGES_NEST_COINGECKO_API_VS_CURRENCY,
          order: 'id_asc',
          per_page: 250,
          page,
          precision: 'full',
        },
      });
      return result.data.map(item => ({
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        image: item.image,
        current_price: item.current_price,
        market_cap: item.market_cap,
        last_updated: item.last_updated,
        high_24h: item.high_24h,
        low_24h: item.low_24h,
      }));
    } catch (error: any) {
      this.loggerService.error(`Failed to list coins with market data. ${error.message}`);
      throw error;
    }
  }
}
