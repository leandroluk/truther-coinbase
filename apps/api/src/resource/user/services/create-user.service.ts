import {Injectable} from '@nestjs/common';
import {ConflitError, TCreateUser_Data, type TCreateUser} from '@repo/domain';
import {Validate} from '@repo/nest-common';
import {CryptoService} from '@repo/nest-crypto';
import {DatabaseService, UserEntity} from '@repo/nest-database';

@Injectable()
export class CreateUserService implements TCreateUser {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cryptoService: CryptoService
  ) {}

  @Validate([TCreateUser_Data.validator])
  async run(data: TCreateUser_Data): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const emailExists = await entityManager.count(UserEntity, {where: {email: data.email}});
      if (emailExists) {
        throw new ConflitError('Already exists "User" with received email');
      }
      await entityManager.save(
        entityManager.create(UserEntity, {
          email: data.email,
          name: data.name,
          role: data.role,
          password: this.cryptoService.hash(data.password),
        })
      );
    });
  }
}
