import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateCoinTable1752088258157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "Coin" (
        "id"        BIGSERIAL      NOT NULL,
        "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "removedAt" TIMESTAMPTZ(3)     NULL,
        "name"      VARCHAR(100)   NOT NULL,
        "symbol"    VARCHAR(10)    NOT NULL,
        "thumb"     TEXT           NOT NULL,
        "slug"      VARCHAR(100)   NOT NULL,
        --
        PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "Coin";');
  }
}
