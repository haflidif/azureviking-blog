import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import svelteParser from 'svelte-eslint-parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  // TypeScript files
  ...tseslint.configs.recommended,

  // Astro files
  ...eslintPluginAstro.configs.recommended,

  // Svelte files
  ...eslintPluginSvelte.configs.recommended,
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // Global ignores
  {
    ignores: ['dist/', 'node_modules/', '.astro/', 'build/'],
  },

  // Custom rules
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
