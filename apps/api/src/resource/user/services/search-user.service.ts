import {Injectable} from '@nestjs/common';
import {TSearchUser, TSearchUser_Query, TSearchUser_Result} from '@repo/domain';
import {Validate} from '@repo/nest-common';
import {DatabaseService, UserView} from '@repo/nest-database';

@Injectable()
export class SearchUserService implements TSearchUser {
  constructor(private readonly databaseService: DatabaseService) {}

  @Validate([TSearchUser_Query.validator])
  async run(query: TSearchUser_Query): Promise<TSearchUser_Result> {
    const result = await this.databaseService.search(UserView, query);
    return result;
  }
}
