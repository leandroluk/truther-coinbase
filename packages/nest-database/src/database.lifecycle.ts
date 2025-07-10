import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {DatabaseService} from './database.service';

@Injectable()
export class DatabaseLifecycle implements OnApplicationBootstrap {
  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.databaseService.connect();
  }
}
