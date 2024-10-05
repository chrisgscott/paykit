module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
      'plugin:react/jsx-runtime'
    ],
    rules: {
      // Add any custom rules here
      'react/prop-types': 'off'
    }
  };