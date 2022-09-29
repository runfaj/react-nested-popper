module.exports = {
  presets: [
    // check https://github.com/babel/babel/blob/main/packages/babel-preset-env/src/available-plugins.ts to see which plugins are included in preset-env
    ['@babel/preset-env',
      { corejs: '3.25', useBuiltIns: 'entry', debug: false },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators',
      { legacy: true },
    ], // required for mobx decorators. Must come above class-properties
    ['@babel/plugin-proposal-class-properties',
      { loose: false },
    ], // required for mobx decorators
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-pipeline-operator',
      { proposal: 'minimal' },
    ],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-function-bind',
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
