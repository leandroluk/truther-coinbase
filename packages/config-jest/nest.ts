import type {Config} from 'jest';
import baseConfig from './base';

export default {
  ...baseConfig,
  transform: {'^.+\\.(t|j)s$': 'ts-jest'},
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as const satisfies Config;
