import {type TUser} from './user';

export type TSession = {
  key: string;
  userId: TUser['id'];
  ttl: Date;
};
