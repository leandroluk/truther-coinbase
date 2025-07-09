import {IndexableColumn} from '#/decorators';
import {Entity, getMetadataArgsStorage} from 'typeorm';

@Entity()
class TestEntity {
  @IndexableColumn()
  id!: number;
}

describe('decorators/indexable-column', () => {
  it('map expected references', async () => {
    const columns = getMetadataArgsStorage().columns;
    const column = columns.find(c => c.propertyName === 'id' && c.target === TestEntity);
    expect(column).toBeDefined();
    expect(column?.options.name).toBe('id');
    expect(column?.options.type).toBe('bigint');
    expect(column?.options.generated).toBe('increment');
  });
});
