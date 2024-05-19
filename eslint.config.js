const typeScriptEsLintPlugin = require('@typescript-eslint/eslint-plugin');
const {FlatCompat} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typeScriptEsLintPlugin.configs['recommended'],
});

const config = [
  ...compat.config({
    env: {node: true},
    extends: ['plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
    },
  }),
  {
    files: ["**/*.ts", "**/*.tsx"],
  },
  {
    // extends: ['plugin:@typescript-eslint/recommended'],
    // "extends": [
    //   "react-app",
    //   "react-app/jest",
    //   "standard",
    //   "standard-jsx",
    //   "standard-react"
    // ],
    // "plugins": [
    //   "jsx-a11y"
    // ],
    "rules": {
      "no-use-before-define": "off",
      // "@typescript-eslint/no-use-before-define": ["error"],
      "comma-dangle": [
        "error",
        {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "always-multiline",
          "functions": "always-multiline"
        }
      ],
      "no-undef": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-pascal-case": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["off", {
        "ignoreRestSiblings": true
      }]
    },
  },
  {
    ignores: ['assets/*', 'dist/*', '*.config*'],
  }
]

module.exports = config;
