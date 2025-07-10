import globals from 'globals';
import baseConfig from './base.js';
import jestConfig from './jest.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ...baseConfig,
    name: 'nest',
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
  },
  jestConfig,
];
