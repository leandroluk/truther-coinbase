import {EUserRole} from '@repo/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateUserRoleType1752087852743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "UserRole" AS ENUM (
        '${EUserRole.Admin}', 
        '${EUserRole.Member}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE "UserRole";');
  }
}
