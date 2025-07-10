import {FullTextView} from '#/decorators';
import {getMetadataArgsStorage} from 'typeorm';

@FullTextView({name: 'Decorated', fullTextFields: ['title', 'description']})
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

describe('decorators/full-text-view.decorator', () => {
  it('FullTextView stores metadata correctly', () => {
    const fields = FullTextView.get(Decorated);
    expect(fields).toEqual(['title', 'description']);
  });
  it("FullTextEntity return empty array when property isn't defined", () => {
    const fields = FullTextView.get(Class);
    expect(fields).toEqual([]);
  });
  it('FullTextView still registers the class as a TypeORM view', () => {
    const entities = getMetadataArgsStorage().tables;
    const registered = entities.find(e => e.target === Decorated);
    expect(registered).toBeDefined();
    expect(registered?.name).toBe('Decorated');
  });
});
