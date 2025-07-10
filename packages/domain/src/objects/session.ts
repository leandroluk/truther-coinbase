import {type EOidcProvider} from '#/enums';
import {type TUser} from './user';

export type TSession = {
  key: string;
  user: Omit<TUser, 'password'>;
  refreshToken?: string;
  provider?: EOidcProvider;
  ttl: Date;
};
