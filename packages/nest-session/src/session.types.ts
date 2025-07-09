import {type TUser} from '@truther-coinbase/domain';

export type TSession = {
  userId: TUser['id'];
  ttl: number;
};
