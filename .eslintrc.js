module.exports = {
  'extends': 'airbnb',
  'plugins': [],
  globals: {},
  rules: {
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'strict': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'global-require': 'off'
  },
  env: {
    node: true,
    jasmine: true,
    es6: true
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};
