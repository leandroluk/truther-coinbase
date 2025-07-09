import {EUserRole} from '@repo/domain';
import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateUserTable1752087901147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "User" (
        "id"        BIGSERIAL      NOT NULL,
        "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "removedAt" TIMESTAMPTZ(3)     NULL,
        "name"      VARCHAR(100)   NOT NULL,
        "email"     VARCHAR(100)   NOT NULL,
        "password"  TEXT           NOT NULL,
        "role"      "UserRole"     NOT NULL DEFAULT '${EUserRole.Member}',
        --
        PRIMARY KEY ("id"),
        UNIQUE ("email")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "User";');
  }
}
