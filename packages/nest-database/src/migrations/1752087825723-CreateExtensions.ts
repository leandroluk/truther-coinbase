import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateExtensions1752087825723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION fuzzystrmatch;');
    await queryRunner.query('CREATE EXTENSION pg_trgm;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION fuzzystrmatch;');
    await queryRunner.query('DROP EXTENSION pg_trgm;');
  }
}
