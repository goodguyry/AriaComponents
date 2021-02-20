module.exports = {
  // Extend the AirBnb lint config
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    siteClassNames: true,
    getEventDetails: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    indent: [
      2, 2,
      { SwitchCase: 1 },
    ],
    'max-len': [
      2, 80, 4,
      {
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    quotes: [2, 'single'],
    semi: [2, 'always'],
    'no-multiple-empty-lines': [2, { max: 1 }],
    'comma-dangle': [2, 'always-multiline'],
    'dot-location': [2, 'property'],
    'one-var': [2, 'never'],
    'no-var': [2],
    'prefer-const': ['error'],
    'no-bitwise': [2],
    'id-length': [
      'error',
      {
        properties: 'never',
        exceptions: ['x', 'y', 'i', 'e', 'n', 'k'],
      },
    ],
    'func-names': [1, 'always'],
    'no-use-before-define': [2, 'nofunc'],
    yoda: [2, 'always'],
    'object-curly-spacing': [2, 'always'],
    'array-bracket-spacing': [2, 'never'],
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: true,
        overrides: {
          '-': false,
        },
      },
    ],
    'keyword-spacing': ['error', { after: true }],
    'space-before-blocks': [2, 'always'],
    'space-in-parens': [2, 'never'],
    'spaced-comment': [2, 'always'],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-constant-condition': ['error'],
    'arrow-parens': ['error', 'always'],
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': [
      'error',
      {
        'allow': [
          '_suppressDispatch',
        ],
      },
    ],
  },
};
