import type {Config} from 'jest';
import baseConfig from './base';


export default {
  ...baseConfig,
  collectCoverageFrom: baseConfig.collectCoverageFrom!.concat('!**/main.ts'),
  transform: {'^.+\\.(t|j)s$': 'ts-jest'},
  testEnvironment: 'node',
} as const satisfies Config;
