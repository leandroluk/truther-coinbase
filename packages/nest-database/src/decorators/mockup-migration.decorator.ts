export function MockupMigration(): ClassDecorator {
  return function (target: object) {
    (target as any).mockup = true;
  };
}
