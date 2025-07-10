import {CoingeckoApiService} from '#/coingecko-api.service';
import axios from 'axios';

jest.mock('@repo/nest-common', () => ({
  ...jest.requireActual('@repo/nest-common'),
  Retry: () => (_target, _propertyKey, descriptor) => descriptor,
}));

const makeSut = async () => {
  const coingeckoApiEnv = {
    PACKAGES_NEST_COINGECKO_API_BASE_URL: 'https://fake-url.com',
    PACKAGES_NEST_COINGECKO_API_HEADER: 'x-api-key',
    PACKAGES_NEST_COINGECKO_API_KEY: 'abc123',
    PACKAGES_NEST_COINGECKO_API_VS_CURRENCY: 'usd',
  };
  const loggerService = {error: jest.fn()};
  const axiosInstance = {get: jest.fn()};
  jest.spyOn(axios, 'create').mockReturnValueOnce(axiosInstance as any);
  const sut = new CoingeckoApiService(coingeckoApiEnv as any, loggerService as any);
  return {coingeckoApiEnv, loggerService, axiosInstance, sut};
};

describe('CoingeckoApiService', () => {
  describe('ping', () => {
    it('should throw and log when axios throws', async () => {
      const {sut, loggerService, axiosInstance} = await makeSut();
      axiosInstance.get.mockRejectedValue(new Error());
      await expect(sut.ping()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should succeed when axios resolves', async () => {
      const {sut, axiosInstance} = await makeSut();
      axiosInstance.get.mockResolvedValueOnce({});
      await expect(sut.ping()).resolves.toBeUndefined();
    });
  });

  describe('coinsMarkets', () => {
    it('should throw and log when axios throws', async () => {
      const {sut, loggerService, axiosInstance} = await makeSut();
      axiosInstance.get.mockRejectedValue(new Error());
      await expect(sut.coinsMarkets()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should return mapped data when axios succeeds', async () => {
      const {sut, axiosInstance} = await makeSut();
      const data = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          current_price: 30000,
          market_cap: 1000000000,
          last_updated: '2024-01-01T00:00:00Z',
          high_24h: 31000,
          low_24h: 29000,
        },
      ];
      axiosInstance.get.mockResolvedValueOnce({data});
      await expect(sut.coinsMarkets(1)).resolves.toEqual(data);
    });
  });
});
