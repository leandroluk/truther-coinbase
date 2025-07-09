import {RemovableColumn} from '#/decorators';
import {Entity, getMetadataArgsStorage} from 'typeorm';

@Entity()
class TestEntity {
  @RemovableColumn()
  removedAt!: number;
}

describe('decorators/removable-column', () => {
  it('map expected references', async () => {
    const columns = getMetadataArgsStorage().columns;
    const column = columns.find(c => c.propertyName === 'removedAt' && c.target === TestEntity);
    expect(column).toBeDefined();
    expect(column?.options.name).toBe('removedAt');
    expect(column?.options.type).toBe('timestamptz');
    expect(column?.options.precision).toBe(3);
    expect(column?.options.nullable).toBe(true);
  });
});
