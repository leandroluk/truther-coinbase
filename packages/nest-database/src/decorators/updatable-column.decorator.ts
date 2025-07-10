import {type ColumnOptions, UpdateDateColumn} from 'typeorm';

export function UpdatableColumn(options?: Omit<ColumnOptions, 'name' | 'type' | 'precision'>): PropertyDecorator {
  return UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
    precision: 3,
    ...options,
  });
}
