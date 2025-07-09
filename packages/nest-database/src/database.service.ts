import {Injectable} from '@nestjs/common';
import {TSearchOperator, TSearchQuery, TSearchResult} from '@repo/domain/dist/types';
import {LoggerService} from '@repo/nest-logger';
import {DataSource, MixedList, ObjectLiteral, type EntityTarget} from 'typeorm';
import {DatabaseEnv} from './database.env';
import {FullTextEntity} from './decorators';
import * as entities from './entities';
import * as migrations from './migrations';
import * as views from './views';

type OperatorFn = (field: string, value: any) => [string, ObjectLiteral];

@Injectable()
export class DatabaseService extends DataSource {
  readonly aliasName = 'x';

  operatorsMapToTypeORM: Record<TSearchOperator, OperatorFn> = {
    eq: (field, value) => [`(${this.aliasName}.${field} = :${field})`, {[field]: value}],
    gt: (field, value) => [`(${this.aliasName}.${field} > :${field})`, {[field]: value}],
    gte: (field, value) => [`(${this.aliasName}.${field} >= :${field})`, {[field]: value}],
    lt: (field, value) => [`(${this.aliasName}.${field} < :${field})`, {[field]: value}],
    lte: (field, value) => [`(${this.aliasName}.${field} <= :${field})`, {[field]: value}],
    in: (field, value) => [`(${this.aliasName}.${field} IN :${field})`, {[field]: value}],
    like: (field, value) => [`(${this.aliasName}.${field} ILIKE :${field})`, {[field]: `%${value as string}%`}],
    neq: (field, value) => [`(NOT (${this.aliasName}.${field} = :${field}))`, {[field]: value}],
    ngt: (field, value) => [`(NOT (${this.aliasName}.${field} > :${field}))`, {[field]: value}],
    ngte: (field, value) => [`(NOT (${this.aliasName}.${field} >= :${field}))`, {[field]: value}],
    nlt: (field, value) => [`(NOT (${this.aliasName}.${field} < :${field}))`, {[field]: value}],
    nlte: (field, value) => [`(NOT (${this.aliasName}.${field} <= :${field}))`, {[field]: value}],
    nin: (field, value) => [`(NOT (${this.aliasName}.${field} IN :${field}))`, {[field]: value}],
    nlike: (field, value) => [`(NOT (${this.aliasName}.${field} ILIKE :${field}))`, {[field]: `%${value as string}%`}],
  };

  sortMapToTypeORM: Record<number, 'ASC' | 'DESC'> = {
    [1]: 'ASC',
    [-1]: 'DESC',
  };

  constructor(
    private readonly databaseEnv: DatabaseEnv,
    private readonly loggerService: LoggerService
  ) {
    super({
      type: 'postgres',
      url: databaseEnv.PACKAGES_NEST_DATABASE_URL,
      entities: Object.values<Function>(entities).concat(Object.values(views)),
      migrations: Object.values(migrations).filter(m => !(m as any).mockup) as MixedList<Function | string>,
      logging: databaseEnv.PACKAGES_NEST_DATABASE_LOGGING,
    });
  }

  async connect(): Promise<this> {
    try {
      await this.initialize();
      if (this.databaseEnv.PACKAGES_NEST_DATABASE_MIGRATE) {
        await this.runMigrations({transaction: 'each'});
      }
      return this;
    } catch (error: any) {
      this.loggerService.error(`Failed to init. ${error.message}`);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.query('SELECT 1');
    } catch (error) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  getReplaceableColumnDatabaseNames<T extends ObjectLiteral = any>(entityTarget: EntityTarget<T>): string[] {
    const metadata = this.getMetadata(entityTarget);
    const replaceableColumnNames = metadata.columns.filter(column => !column.isPrimary && !column.isCreateDate);
    const uniqueColumnsAtClassLevel = new Set<string>();
    for (const unique of metadata.uniques) {
      for (const column of unique.columns) {
        uniqueColumnsAtClassLevel.add(column.databaseName);
      }
    }
    return replaceableColumnNames
      .filter(column => !uniqueColumnsAtClassLevel.has(column.propertyName))
      .map(column => column.databaseName);
  }

  getUniqueColumnDatabaseNames<T extends ObjectLiteral = any>(entityTarget: EntityTarget<T>): string[] {
    const metadata = this.getMetadata(entityTarget);
    const uniqueColumnsAtClassLevel = new Set<string>();
    for (const unique of metadata.uniques) {
      for (const column of unique.columns) {
        uniqueColumnsAtClassLevel.add(column.databaseName);
      }
    }
    return Array.from(uniqueColumnsAtClassLevel);
  }

  async search<T extends ObjectLiteral, P extends boolean = false>(
    entityTarget: EntityTarget<T>,
    query: TSearchQuery<T>,
    availableFields: Array<string & keyof T> = this.getMetadata(entityTarget).columns.map(column => column.propertyName)
  ): Promise<TSearchResult<T, P>> {
    let fields = availableFields;

    if (query.fields?.select) {
      fields = query.fields.select;
    } else if (query.fields?.remove) {
      fields = availableFields.filter(field => !query.fields?.remove!.includes(field));
    }

    let builder = this.createQueryBuilder()
      .from(entityTarget, this.aliasName)
      .select(fields.map(field => `${this.aliasName}.${field}`))
      .distinct()
      .where('1 = 1');

    if (query.text) {
      /** @see https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql */
      const fullTextEntityFields = FullTextEntity.get(entityTarget);
      const matcher = fullTextEntityFields
        .map(field => [
          `${this.aliasName}."${String(field)}"::text ILIKE :perc`,
          `SOUNDEX(${this.aliasName}."${String(field)}"::text) = SOUNDEX(:raw)`,
          `LEVENSHTEIN(LOWER(${this.aliasName}."${String(field)}"::text), LOWER(:raw)) < 4`,
        ])
        .flatMap(inner => inner)
        .join(' OR ');
      if (matcher) {
        builder = builder.andWhere(`(${matcher})`, {raw: query.text, perc: `%${query.text}%`});
      }
    }

    if (Object.keys(query.where ?? {}).length) {
      Object.entries(query.where!).forEach(([field, condition]) => {
        Object.entries(condition!).forEach(([op, value]) => {
          const [text, parameter] = this.operatorsMapToTypeORM[op](field, value);
          builder = builder.andWhere(text, parameter);
        });
      });
    }

    if (Object.keys(query.sort ?? {}).length) {
      const [first, ...rest] = Object.entries(query.sort!) as Array<[string & keyof T, number]>;
      builder = builder.orderBy(`"${first![0]}"`, this.sortMapToTypeORM[first![1]]);
      rest.forEach(next => (builder = builder.addOrderBy(`"${next[0]}"`, this.sortMapToTypeORM[next[1]])));
    }

    const {offset = 0, limit = this.databaseEnv.PACKAGES_NEST_DATABASE_DEFAULT_LIMIT} = query;

    const [items, total] = await builder.skip(offset).take(limit).getManyAndCount();

    return {items, total, limit, offset} as TSearchResult<T, P>;
  }
}
