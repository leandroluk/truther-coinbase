import {type ColumnOptions, CreateDateColumn} from 'typeorm';

export function CreatableColumn(options?: Omit<ColumnOptions, 'name' | 'type' | 'precision'>): PropertyDecorator {
  return CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
    precision: 3,
    ...options,
  });
}
