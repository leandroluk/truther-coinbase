export type TLogoffAuth = {
  run(data: TLogoffAuth.Data): Promise<void>;
};
export namespace TLogoffAuth {
  export type Data = {
    sessionId: string;
  };
}
