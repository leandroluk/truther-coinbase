import {Injectable} from '@nestjs/common';
import {ServerError, THealthcheck_Result, type THealthcheck} from '@repo/domain';
import {CacheService} from '@repo/nest-cache';
import {DatabaseService} from '@repo/nest-database';
import ms from 'ms';

@Injectable()
export class HealthcheckService implements THealthcheck {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService
  ) {}
  async run(): Promise<THealthcheck_Result> {
    try {
      await Promise.all([this.cacheService.ping(), this.databaseService.ping()]);
      return {uptime: ms(process.uptime() * 1000)};
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }
}
