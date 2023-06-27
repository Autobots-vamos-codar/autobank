module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['off', 'always'],
    'import/extensions': 0,
    'prefer-destructuring': 0,
    'no-console': 0,
    'import/no-extraneous-dependencies': ['off', 'always'],
  },
};
