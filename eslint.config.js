import globals from 'globals';
import pluginJs from '@eslint/js';
/** @type {import('eslint').Linter.Config[]} \*/
export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
