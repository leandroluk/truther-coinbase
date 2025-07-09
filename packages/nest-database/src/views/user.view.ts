import {FullTextView} from '#/decorators';
import {type EUserRole, type TSearchUser_Item} from '@repo/domain';
import {ViewColumn} from 'typeorm';

@FullTextView<UserView>({
  name: 'UserView',
  fullTextFields: [
    'id', //
    // 'updatedAt',
    // 'createdAt',
    // 'removedAt',
    'name',
    'email',
    'role',
  ],
})
export class UserView implements TSearchUser_Item {
  @ViewColumn({name: 'id'})
  id!: number;

  @ViewColumn({name: 'updatedAt'})
  updatedAt!: Date;

  @ViewColumn({name: 'createdAt'})
  createdAt!: Date;

  @ViewColumn({name: 'removedAt'})
  removedAt!: Date | null;

  @ViewColumn({name: 'name'})
  name!: string;

  @ViewColumn({name: 'email'})
  email!: string;

  @ViewColumn({name: 'role'})
  role!: EUserRole;
}
