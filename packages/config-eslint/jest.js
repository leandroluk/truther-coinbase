
/** @type {import('eslint').Linter.Config} */
export default {
  name: 'jest',
  files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off'
  },
}
