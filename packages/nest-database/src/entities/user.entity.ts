import {CreatableColumn, FullTextEntity, IndexableColumn, RemovableColumn, UpdatableColumn} from '#/decorators';
import {EUserRole, TUser} from '@repo/domain';
import {Column} from 'typeorm';

@FullTextEntity<UserEntity>({
  name: 'User',
  fullTextFields: [
    'id', //
    // 'updatedAt',
    // 'createdAt',
    // 'removedAt',
    'name',
    'email',
    // 'password',
    'role',
  ],
})
export class UserEntity implements TUser {
  @IndexableColumn()
  id!: number;

  @UpdatableColumn()
  updatedAt!: Date;

  @CreatableColumn()
  createdAt!: Date;

  @RemovableColumn()
  removedAt!: Date | null;

  @Column({name: 'name', type: 'varchar', length: 100})
  name!: string;

  @Column({name: 'email', type: 'varchar', length: 100})
  email!: string;

  @Column({name: 'password', type: 'text'})
  password!: string;

  @Column({name: 'role', type: 'enum', enum: EUserRole})
  role!: EUserRole;
}
