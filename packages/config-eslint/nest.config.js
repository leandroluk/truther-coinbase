import globals from 'globals';
import base from './base.config.js';

/** @type {import("eslint").Linter.Config} */
export default {
  ...base,
  name: 'nest',
  rules: {
    ...base.rules,
  },
  languageOptions: {
    ...base.languageOptions,
    globals: {
      ...globals.node,
      ...globals.jest
    }
  },
  files: ['**/*.ts', '**/*.js', '**/*.cts', '**.*.mts'],
};
