import {MockupMigration} from '#/decorators';

@MockupMigration()
class TestMigration {}

describe('decorators/mockup-migration.decorator', () => {
  it('class must have a static mockup property', () => {
    expect((TestMigration as any).mockup).toBeTruthy();
  });
});
