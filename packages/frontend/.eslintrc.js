module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "prettier",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  "env": {
    "browser": true,
    "es2021": true,
  },
  ignorePatterns: ['.eslintrc.js'],
  "rules": {
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
