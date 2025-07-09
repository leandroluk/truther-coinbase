import {type TUser} from '@repo/domain';

export type TSession = {
  userId: TUser['id'];
  ttl: number;
};
