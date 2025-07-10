import {Injectable} from '@nestjs/common';
import {NotFoundError, TUpdateUserProfile_Data, type TUpdateUserProfile} from '@repo/domain';
import {Validate} from '@repo/nest-common';
import {CryptoService} from '@repo/nest-crypto';
import {DatabaseService, UserEntity} from '@repo/nest-database';

@Injectable()
export class UpdateUserProfileService implements TUpdateUserProfile {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cryptoService: CryptoService
  ) {}

  @Validate([TUpdateUserProfile_Data.validator])
  async run({id, changes: {password, ...changes}}: TUpdateUserProfile_Data): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const user = await entityManager.findOne(UserEntity, {where: {id}});
      if (!user) {
        throw new NotFoundError('Cannot find "user" with received id');
      }
      if (password) {
        user.password = this.cryptoService.hash(password);
      }
      Object.assign(user, changes);
      await entityManager.save(UserEntity, user);
    });
  }
}
