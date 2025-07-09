import {CreatableColumn} from '#/decorators';
import {Entity, getMetadataArgsStorage} from 'typeorm';

@Entity()
class TestEntity {
  @CreatableColumn()
  createdAt!: Date;
}

describe('decorators/creatable-column', () => {
  it('map expected references', async () => {
    const columns = getMetadataArgsStorage().columns;
    const column = columns.find(c => c.propertyName === 'createdAt' && c.target === TestEntity);
    expect(column).toBeDefined();
    expect(column?.options.name).toBe('createdAt');
    expect(column?.options.type).toBe('timestamptz');
    expect(column?.options.precision).toBe(3);
  });
});
