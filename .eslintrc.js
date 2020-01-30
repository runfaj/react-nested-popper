const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb'],
  globals: {
    _: false,
    autoprefixer: false,
    io: false,
    path: false,
  },
  parser: 'babel-eslint',
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "spreadElement": true,
      "restElement": true,
    }
  },
  plugins: ['import', 'react'],
  root: true,
  rules: {
    'arrow-parens': OFF,
    'block-spacing': OFF,
    'camelcase': [
      "error",
      {
        allow: [
          "[A-Z][a-zA-Z0-9]*_[A-Z][a-zA-Z0-9]*", // example: Common_SubComponent
          ["^UNSAFE_"], //for react deprecation warning
        ],
      }
    ],
    'class-methods-use-this': OFF,
    'comma-dangle': [
      ERROR,
      {
        // `airbnb` defaults to ERROR
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore', // this prevents "ESLint Autofix" from ADDING commas. Once we upgrade Node to support trailing commas in parameters we can eliminate this.
      },
    ],
    'import/extensions': WARN,
    'import/order': WARN,
    'import/no-named-as-default': OFF,
    'import/no-unresolved': OFF, // have to disable due to webpack aliasing issues
    'lines-between-class-members': [
      ERROR,
      'always',
      { exceptAfterSingleLine: true }
    ],
    'max-classes-per-file': OFF,
    'max-len': OFF,
    'no-else-return': OFF,
    'no-multi-spaces': [
      ERROR,
      { exceptions: { Property: true, VariableDeclarator: true, ImportDeclaration: true } }
    ],
    'no-nested-ternary': OFF,
    'no-param-reassign': OFF,
    'no-trailing-spaces': [
      ERROR,
      {
        skipBlankLines: true,
        ignoreComments: true,
      },
    ],
    'no-underscore-dangle': OFF,
    'no-use-before-define': OFF,
    'object-curly-newline': OFF,
    'prefer-template': OFF, // There are some cases where it is easier to read with string concatenation vs template-string. Such as when you need a line break.
    'radix': [ERROR, 'as-needed'],
    'react/destructuring-assignment': OFF,
    'react/forbid-prop-types': OFF,
    'react/jsx-curly-newline': OFF,
    'react/jsx-filename-extension': [
      OFF,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-pascal-case': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/prop-types': OFF, // Will cause errors with injected stores that don't need propTypes
    'react/sort-comp': [
      ERROR,
      {
        order: [
          'static-variables',
          'static-methods',
          '/^observable/',
          'instance-variables',
          'lifecycle',
          'getters',
          'setters',
          'everything-else',
          '/^on.+$/',
          '/^handle.+$/',
          '/^toggle.+$/',
          'rendering',
        ],
        groups: {
          rendering: [
            'render',
            '/^render.+$/',
          ]
        }
      }
    ],
    'react/state-in-constructor': OFF,
  },
  settings: {
    'import/resolver': 'webpack',
  },
};