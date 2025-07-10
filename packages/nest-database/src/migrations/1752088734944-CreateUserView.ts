import {type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateUserView1752088734944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE VIEW "UserView" AS
      SELECT DISTINCT
        u."id"        AS "id",
        u."updatedAt" AS "updatedAt",
        u."createdAt" AS "createdAt",
        u."removedAt" AS "removedAt",
        u."name"      AS "name",
        u."email"     AS "email",
        u."role"      AS "role"
      FROM "User" AS u
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW "UserView";');
  }
}
