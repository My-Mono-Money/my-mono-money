module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "typescript": require.resolve('typescript')
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
    "prettier",
  ],
  "env": {
    "browser": true,
    "es2021": true,
  },
  ignorePatterns: ['.eslintrc.cjs'],
  "rules": {
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
