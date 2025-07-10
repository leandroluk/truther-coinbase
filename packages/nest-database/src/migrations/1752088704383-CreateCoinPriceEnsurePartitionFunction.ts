import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateCoinPriceEnsurePartitionFunction1752088704383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE FUNCTION "CoinPriceEnsurePartition"() RETURNS void AS
      $$
      DECLARE
        count           INT;
        month_start     DATE := date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
        month_end       DATE := month_start + INTERVAL '1 month';
        part_name       TEXT := format('CoinPrice_%s_%s', to_char(month_start, 'YYYY'), to_char(month_start, 'MM'));
        idx_updated_at  TEXT := part_name || '_idx_updatedAt';
        idx_coin_id     TEXT := part_name || '_idx_coinId';
      BEGIN
        SELECT COUNT(*) INTO count FROM pg_inherits i
        JOIN pg_class c ON i.inhrelid = c.oid
        WHERE i.inhparent = '"CoinPrice"'::regclass AND c.relname = part_name;

        IF count = 0 THEN
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
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query('SELECT "CoinPriceEnsurePartition"();');
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

    await queryRunner.query('DROP FUNCTION IF EXISTS "CoinPriceEnsurePartition"();');
  }
}
