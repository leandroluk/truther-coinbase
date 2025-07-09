import {FullTextEntity} from '#/decorators';
import {getMetadataArgsStorage} from 'typeorm';

@FullTextEntity({name: 'Decorated', fullTextFields: ['title', 'description']})
class Decorated {
  title!: string;
  description!: string;
  otherField!: string;
}

class Class {
  title!: string;
  description!: string;
  otherField!: string;
}

describe('decorators/full-text-entity.decorator', () => {
  it('FullTextEntity stores metadata correctly', () => {
    const fields = FullTextEntity.get(Decorated);
    expect(fields).toEqual(['title', 'description']);
  });
  it("FullTextEntity return empty array when property isn't defined", () => {
    const fields = FullTextEntity.get(Class);
    expect(fields).toEqual([]);
  });
  it('FullTextEntity still registers the class as a TypeORM entity', () => {
    const entities = getMetadataArgsStorage().tables;
    const registered = entities.find(e => e.target === Decorated);
    expect(registered).toBeDefined();
    expect(registered?.name).toBe('Decorated');
  });
});
