import {PrimaryColumn, type PrimaryColumnOptions} from 'typeorm';

export function IndexableColumn(
  options?: Omit<PrimaryColumnOptions, 'name' | 'type' | 'generated'>
): PropertyDecorator {
  return PrimaryColumn({
    name: 'id',
    type: 'bigint',
    generated: 'increment',
    ...options,
  });
}
