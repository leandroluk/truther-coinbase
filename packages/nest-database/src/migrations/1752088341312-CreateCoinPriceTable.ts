import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateCoinPriceTable1752088341312 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "CoinPrice" (
        "id"        BIGSERIAL      NOT NULL,
        "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "marketCap" FLOAT          NOT NULL,
        "value"     FLOAT          NOT NULL,
        "coinId"    BIGINT         NOT NULL,
        --
        PRIMARY KEY ("id", "updatedAt"),
        FOREIGN KEY ("coinId") REFERENCES "Coin" ("id")
      ) PARTITION BY RANGE ("updatedAt");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "CoinPrice";');
  }
}
