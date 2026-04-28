// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // Guardrails: discourage raw hex colors in components.
  // Prefer tokens from `src/shared/theme/colors.ts`.
  //
  // NOTE: kept as "warn" for incremental migration.
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,8})$/]",
          message:
            'Do not use raw hex colors in components. Use theme tokens from src/shared/theme/colors.ts instead.',
        },
      ],
    },
  },
  {
    files: ['src/shared/theme/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
]);
