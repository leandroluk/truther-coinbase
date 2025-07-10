import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {SchedulerRegistry} from '@nestjs/schedule';
import {CronJob} from 'cron';
import {CoinEnv} from './coin.env';
import {ImportFromCoingeckoWorker} from './workers';

@Injectable()
export class CoinLifecycle implements OnApplicationBootstrap {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly coinEnv: CoinEnv,
    private readonly importFromCoingeckoWorker: ImportFromCoingeckoWorker
  ) {}

  onApplicationBootstrap(): void {
    if (this.coinEnv.APPS_API_RESOUCES_COIN_RUN_ON_START) {
      void this.importFromCoingeckoWorker.run();
    }
    const job = new CronJob(this.coinEnv.APPS_API_RESOUCES_COIN_CRON, () =>
      this.importFromCoingeckoWorker.run().catch(/* do nothing */)
    );
    // using any because "cron" lib used by "@nestjs/schedule" is outdated
    this.schedulerRegistry.addCronJob(this.constructor.name, job as any);
    job.start();
  }
}
