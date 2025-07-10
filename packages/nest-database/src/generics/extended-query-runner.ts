import {type TIndexable} from '@repo/domain';
import {type QueryRunner} from 'typeorm';

export class ExtendedQueryRunner {
  constructor(readonly queryRunner: QueryRunner) {}

  async insert<T extends TIndexable, U extends object = Partial<T>>(table: string, entity: U): Promise<T['id']> {
    const keys = Object.keys(entity);
    const sql = `
      INSERT INTO "${table}" (${keys.map(column => `"${column}"`).join()}) 
      VALUES (${keys.map((_, index) => `$${index + 1}`).join()})
      RETURNING "id"`;
    const [row]: TIndexable[] = await this.queryRunner.query(
      sql,
      keys.map(key => entity[key])
    );
    return row!.id;
  }
}
