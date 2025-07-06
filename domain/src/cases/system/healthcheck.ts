import {Swagger} from '#/swagger';

export type THealthcheck = {
  run(): Promise<THealthcheck.Result>;
};
export namespace THealthcheck {
  export type Result = {
    uptime: string;
  };
  export namespace Result {
    export const swagger = Swagger.object<Result>({
      required: ['uptime'],
      properties: {
        uptime: Swagger.string({
          description: 'Uptime of application',
          example: '10d',
        }),
      },
    });
  }
}
