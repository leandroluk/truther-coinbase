import type {Config} from 'jest';

export default {
  roots: ['src', 'test'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'json'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  moduleNameMapper: {'^#/(.*)$': '<rootDir>/src/$1'},
} as const as Config
