import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateCoinView1752089189104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE VIEW "CoinPriceView" AS
      SELECT
        c."id"              AS "id",
        c."updatedAt"       AS "updatedAt",
        c."createdAt"       AS "createdAt",
        c."removedAt"       AS "removedAt",
        c."name"            AS "name",
        c."symbol"          AS "symbol",
        c."slug"            AS "slug",
        cp_last."value"     AS "currentPrice",
        cp_last."parketCap" AS "currentMarketCap",
        cp_max.max_price    AS "highestPrice",
        cp_min.min_price    AS "lowestPrice",
        cp_24h.change       AS "priceChange24h",
        cp_7d.change        AS "priceChange7d"
      FROM "Coin" c
      LEFT JOIN LATERAL (
        SELECT value, parketCap, updatedAt
        FROM "CoinPrice" 
        WHERE "coinId" = c.id 
        ORDER BY "updatedAt" DESC 
        LIMIT 1
      ) cp_last ON true       
      LEFT JOIN (
        SELECT "coinId", MAX("value") AS max_price
        FROM "CoinPrice" 
        GROUP BY "coinId"
      ) cp_max ON cp_max."coinId" = c.id
      LEFT JOIN (
        SELECT "coinId", MIN("value") AS min_price
        FROM "CoinPrice" 
        GROUP BY "coinId"
      ) cp_min ON cp_min."coinId" = c.id
      LEFT JOIN LATERAL (
        SELECT 
          CASE 
            WHEN cp2.value IS NULL THEN NULL 
            ELSE ((cp_last.value - cp2.value) / cp2.value) * 100 
          END AS change
        FROM "CoinPrice" cp2
        WHERE cp2."coinId" = c.id AND cp2."updatedAt" <= (NOW() - INTERVAL '24 hours')
        ORDER BY cp2."updatedAt" DESC 
        LIMIT 1
      ) cp_24h ON true

      LEFT JOIN LATERAL (
        SELECT
          CASE
            WHEN cp3.value IS NULL THEN NULL
            ELSE ((cp_last.value - cp3.value) / cp3.value) * 100
          END AS change
        FROM "CoinPrice" cp3
        WHERE cp3."coinId" = c.id AND cp3."updatedAt" <= (NOW() - INTERVAL '7 days')
        ORDER BY cp3."updatedAt" DESC
        LIMIT 1
      ) cp_7d ON true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW "CoinPriceView";');
  }
}
