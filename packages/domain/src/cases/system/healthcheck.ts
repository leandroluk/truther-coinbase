import {swaggerGenerator} from '#/generators';

export type THealthcheck = {
  run(): Promise<THealthcheck_Result>;
};
export type THealthcheck_Result = {
  uptime: string;
};
export const THealthcheck_Result = {
  swagger: swaggerGenerator.object<THealthcheck_Result>({
    required: ['uptime'],
    properties: {
      uptime: swaggerGenerator.string({
        description: 'Uptime of application',
        example: '10d',
      }),
    },
  }),
};
