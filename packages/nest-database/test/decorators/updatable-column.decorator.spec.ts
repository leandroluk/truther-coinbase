import {UpdatableColumn} from '#/decorators';
import {Entity, getMetadataArgsStorage} from 'typeorm';

@Entity()
class TestEntity {
  @UpdatableColumn()
  removedAt!: number;
}

describe('decorators/updatable-column', () => {
  it('map expected references', async () => {
    const columns = getMetadataArgsStorage().columns;
    const column = columns.find(c => c.propertyName === 'removedAt' && c.target === TestEntity);
    expect(column).toBeDefined();
    expect(column?.options.name).toBe('updatedAt');
    expect(column?.options.type).toBe('timestamptz');
    expect(column?.options.precision).toBe(3);
  });
});
