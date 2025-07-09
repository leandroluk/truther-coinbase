import {type ColumnOptions, DeleteDateColumn} from 'typeorm';

export function RemovableColumn(
  options?: Omit<ColumnOptions, 'name' | 'type' | 'precision' | 'default' | 'nullable'> //
): PropertyDecorator {
  return DeleteDateColumn({
    name: 'removedAt',
    type: 'timestamptz',
    precision: 3,
    nullable: true,
    ...options,
  });
}
