import eslintPluginOnlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import path from 'path';
import baseConfig from './base.js';

/** @type {import("eslint").Linter.Config[]} */
export default {
  ...baseConfig,
  name: 'library',
  plugins: {
    ...baseConfig.plugins,
    'only-warn': eslintPluginOnlyWarn,
  },
  languageOptions: {
    ...baseConfig.languageOptions,
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
