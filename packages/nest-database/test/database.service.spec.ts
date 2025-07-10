import {DatabaseService} from '#/database.service';
import {FullTextEntity} from '#/decorators';

const makeSut = async () => {
  const databaseEnv = {
    PACKAGES_NEST_DATABASE_URL: 'PACKAGES_NEST_DATABASE_URL',
    PACKAGES_NEST_DATABASE_LOGGING: 'PACKAGES_NEST_DATABASE_LOGGING',
    PACKAGES_NEST_DATABASE_MIGRATE: 'PACKAGES_NEST_DATABASE_MIGRATE',
  };
  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };
  const mockBuilder = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[{id: 1}], 1]),
  };
  const sut = new DatabaseService(databaseEnv as any, loggerService as any);
  jest.spyOn(sut, 'createQueryBuilder').mockReturnValue(mockBuilder as any);
  jest.spyOn(sut, 'getMetadata').mockReturnValue({columns: [{propertyName: 'id'}, {propertyName: 'name'}]} as any);
  return {databaseEnv, loggerService, mockBuilder, sut};
};

describe('database.service', () => {
  describe('operatorsMapToTypeORM', () => {
    it('return condition ref', async () => {
      const {sut} = await makeSut();
      for (const key in sut.operatorsMapToTypeORM) {
        expect(sut.operatorsMapToTypeORM[key]('field', 'value')).toBeDefined();
      }
    });
  });

  describe('connect', () => {
    it('throws when initialize throws', async () => {
      const {loggerService, sut} = await makeSut();
      jest.spyOn(sut, 'initialize').mockRejectedValue(new Error());
      await expect(sut.connect()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });
    it('return when success', async () => {
      const {sut} = await makeSut();
      jest.spyOn(sut, 'initialize').mockResolvedValue(undefined as any);
      jest.spyOn(sut, 'runMigrations').mockResolvedValue(undefined as any);
      await expect(sut.connect()).resolves.toBeTruthy();
    });
  });

  describe('ping', () => {
    it('throws when query throws', async () => {
      const {loggerService, sut} = await makeSut();
      jest.spyOn(sut, 'query').mockRejectedValue(new Error());
      await expect(sut.ping()).rejects.toThrow();
      expect(loggerService.error).toHaveBeenCalled();
    });
    it('return when success', async () => {
      const {sut} = await makeSut();
      jest.spyOn(sut, 'query').mockResolvedValue(undefined as any);
      await expect(sut.ping()).resolves.toBeUndefined();
    });
  });

  describe('getReplaceableColumnDatabaseNames', () => {
    it('returns columns that are not primary, not create-date, and not part of unique constraints', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          columns: [
            {propertyName: 'id', databaseName: 'id', isPrimary: true, isCreateDate: false},
            {propertyName: 'createdAt', databaseName: 'created_at', isPrimary: false, isCreateDate: true},
            {propertyName: 'name', databaseName: 'name', isPrimary: false, isCreateDate: false},
            {propertyName: 'email', databaseName: 'email', isPrimary: false, isCreateDate: false},
          ],
          uniques: [{columns: [{propertyName: 'email', databaseName: 'email'}]}] as any,
        } as any;
      };
      expect(sut.getReplaceableColumnDatabaseNames({} as any)).toEqual(['name']);
    });

    it('returns all non-primary and non-createDate columns when no unique constraints exist', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          columns: [
            {propertyName: 'title', databaseName: 'title', isPrimary: false, isCreateDate: false},
            {propertyName: 'views', databaseName: 'views', isPrimary: false, isCreateDate: false},
          ],
          uniques: [],
        } as any;
      };
      expect(sut.getReplaceableColumnDatabaseNames({} as any)).toEqual(['title', 'views']);
    });

    it('returns an empty array when no columns are eligible', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          columns: [
            {propertyName: 'id', databaseName: 'id', isPrimary: true, isCreateDate: false},
            {propertyName: 'createdAt', databaseName: 'created_at', isPrimary: false, isCreateDate: true},
          ],
          uniques: [],
        } as any;
      };
      expect(sut.getReplaceableColumnDatabaseNames({} as any)).toEqual([]);
    });
  });

  describe('getUniqueColumnDatabaseNames', () => {
    it('returns unique column database names from metadata.uniques', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          uniques: [
            {
              columns: [
                {propertyName: 'email', databaseName: 'email'},
                {propertyName: 'username', databaseName: 'username'},
              ],
            },
            {columns: [{propertyName: 'document', databaseName: 'document'}]},
          ],
        } as any;
      };
      expect(sut.getUniqueColumnDatabaseNames({} as any).sort()).toEqual(['document', 'email', 'username'].sort());
    });

    it('returns an empty array when no unique constraints exist', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          uniques: [],
        } as any;
      };
      expect(sut.getUniqueColumnDatabaseNames({} as any)).toEqual([]);
    });

    it('ignores duplicated columns across multiple unique constraints', async () => {
      const {sut} = await makeSut();
      sut.getMetadata = () => {
        return {
          uniques: [
            {
              columns: [
                {propertyName: 'email', databaseName: 'email'},
                {propertyName: 'username', databaseName: 'username'},
              ],
            },
            {columns: [{propertyName: 'email', databaseName: 'email'}]},
          ],
        } as any;
      };
      expect(sut.getUniqueColumnDatabaseNames({} as any).sort()).toEqual(['email', 'username'].sort());
    });
  });

  describe('search', () => {
    it('returns correct search result with basic query', async () => {
      const {sut, mockBuilder} = await makeSut();
      const result = await sut.search<any>({} as any, {
        fields: {select: ['id', 'name']},
        where: {id: {eq: 1}},
        sort: {name: 1, id: -1},
        offset: 0,
        limit: 10,
      });
      expect(mockBuilder.select).toHaveBeenCalledWith(['x.id', 'x.name']);
      expect(mockBuilder.andWhere).toHaveBeenCalledWith('(x.id = :id)', {id: 1});
      expect(mockBuilder.orderBy).toHaveBeenCalledWith('"name"', 'ASC');
      expect(mockBuilder.addOrderBy).toHaveBeenCalledWith('"id"', 'DESC');
      expect(mockBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({items: [{id: 1}], total: 1, limit: 10, offset: 0});
    });

    it('excludes fields when fields.remove is passed', async () => {
      const {sut, mockBuilder} = await makeSut();
      await sut.search({} as any, {
        fields: {remove: ['email']},
      });
      expect(mockBuilder.select).toHaveBeenCalledWith(['x.id', 'x.name']);
    });

    it('adds fuzzy matching with text search', async () => {
      const fullTextSpy = jest.spyOn(FullTextEntity, 'get').mockReturnValue(['name']);
      const {sut, mockBuilder} = await makeSut();
      await sut.search({} as any, {text: 'bitcoin'});
      expect(mockBuilder.andWhere).toHaveBeenCalledWith(expect.stringContaining('ILIKE'), {
        raw: 'bitcoin',
        perc: '%bitcoin%',
      });
      fullTextSpy.mockRestore();
    });
  });
});
