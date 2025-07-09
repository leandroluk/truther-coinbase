import {type TSession} from '#/objects';

export type TLogoffAuth = {
  run(data: TLogoffAuth_Data): Promise<void>;
};
export type TLogoffAuth_Data = {
  session: TSession;
};
