/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPrefixerPlugin = require('autoprefixer');
const CSSNanoPlugin = require('cssnano');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
    port: 8765,
  },
  entry: {
    lib: path.resolve(__dirname, 'src/index.js'),
    demo: path.resolve(__dirname, 'demo/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    pathinfo: false,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: filePath => /node_modules/.test(filePath),
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                localIdentName: '[name]---[local]---[hash:base64:5]',
              },
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  AutoPrefixerPlugin,
                  CSSNanoPlugin,
                ],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ProgressPlugin(true),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './demo/index.template.html',
    }),
    // new BundleAnalyzerPlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-cheap-module-source-map';
    config.optimization = {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    };
  } else {
    config.devtool = 'source-map';
    config.optimization = {
      chunkIds: 'total-size',
      minimize: true,
      moduleIds: 'size',
      splitChunks: {
        cacheGroups: {
          peerDependencies: {
            test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/,
          },
        },
      },
    };
  }

  return config;
};
