import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateCoinPriceEnsurePartitionFunction1752088704383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "CoinPriceEnsurePartition"(dates TEXT[])
      RETURNS void AS
      $$
      DECLARE
        d               TEXT;
        dt              DATE;
        month_start     DATE;
        month_end       DATE;
        part_name       TEXT;
        idx_updated_at  TEXT;
        idx_coin_id     TEXT;
        part_exists     INT;
      BEGIN
        FOREACH d IN ARRAY dates LOOP
          dt := d::date;
          month_start := date_trunc('month', dt);
          month_end := month_start + INTERVAL '1 month';
          part_name := format('CoinPrice_%s_%s', to_char(month_start, 'YYYY'), to_char(month_start, 'MM'));
          idx_updated_at := part_name || '_idx_updatedAt';
          idx_coin_id := part_name || '_idx_coinId';

          SELECT COUNT(*) INTO part_exists
          FROM pg_inherits i
          JOIN pg_class c ON i.inhrelid = c.oid
          WHERE i.inhparent = '"CoinPrice"'::regclass AND c.relname = part_name;

          IF part_exists = 0 THEN
            EXECUTE format(
              'CREATE TABLE %I PARTITION OF "CoinPrice"
               FOR VALUES FROM (DATE %L) TO (DATE %L);',
              part_name,
              month_start,
              month_end
            );

            EXECUTE format(
              'CREATE INDEX IF NOT EXISTS %I ON %I ("updatedAt");',
              idx_updated_at,
              part_name
            );

            EXECUTE format(
              'CREATE INDEX IF NOT EXISTS %I ON %I ("coinId");',
              idx_coin_id,
              part_name
            );
          END IF;
        END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const partitions = await queryRunner.query(`
      SELECT tab.relname
      FROM pg_inherits
      JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
      JOIN pg_class tab ON pg_inherits.inhrelid = tab.oid
      WHERE parent.relname = 'CoinPrice' AND tab.relname LIKE 'CoinPrice_%';
    `);

    for (const partition of partitions) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${partition.relname}" CASCADE;`);
    }

    await queryRunner.query('DROP FUNCTION IF EXISTS "CoinPriceEnsurePartition"(TEXT[]);');
  }
}
