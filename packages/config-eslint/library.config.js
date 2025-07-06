import eslintPluginOnlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import path from 'path';
import base from './base.config.js';

/** @type {import("eslint").Linter.Config} */
export default {
  ...base,
  name: 'library',
  plugins: {
    ...base.plugins,
    'only-warn': eslintPluginOnlyWarn,
  },
  languageOptions: {
    ...base.languageOptions,
    globals: {
      ...globals.React,
      ...globals.JSX,
    },
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(process.cwd(), 'tsconfig.json'),
      },
    },
  },
  ignores: ['.*.js', 'node_modules/', 'dist/'],
  files: ['**/*.ts?(x)', '**/*.js?(x)', '**/*.cts', '**.*.mts'],
};
