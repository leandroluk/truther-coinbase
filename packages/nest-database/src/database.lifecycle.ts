import {Injectable, type OnModuleInit} from '@nestjs/common';
import {DatabaseService} from './database.service';

@Injectable()
export class DatabaseLifecycle implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    await this.databaseService.connect();
  }
}
