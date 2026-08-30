import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

/**
 * Flat ESLint config for ESLint 9 + eslint-config-next 16.
 * eslint-config-next >=16 exports flat config arrays directly, so they are
 * imported and spread here (FlatCompat is not needed and would fail).
 */
const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  prettier,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'scripts/**',
      'public/**',
      'next-env.d.ts',
      'bot/**',
    ],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
