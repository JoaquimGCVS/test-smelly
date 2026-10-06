import js from '@eslint/js';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'test/**/*.js', 'test_refact/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['test/**/*.test.js', 'test_refact/**/*.test.js'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-identical-title': 'error',
    },
  },
];
