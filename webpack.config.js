/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const AutoPrefixerPlugin = require('autoprefixer');
const CSSNanoPlugin = require('cssnano');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;
const useProductionBuild = NODE_ENV === 'production';

module.exports = {
  mode: useProductionBuild ? 'production' : 'development',
  devtool: useProductionBuild ? 'source-map' : 'cheap-module-eval-source-map',
  stats: 'errors-only',
  devServer: {
    compress: true,
    contentBase: false,
    historyApiFallback: true,
    hot: true,
    port: 8765,
    stats: {
      assets: false,
      children: false,
      chunkModules: false,
      chunks: false,
      colors: true,
      hash: false,
      version: false,
      modules: false,
      warningsFilter: warning => !_.contains(warning, 'WARNING in chunk') && !_.contains(warning, 'Conflicting order between'),
    },
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
  optimization: (!useProductionBuild
    ? {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    }
    : {
      splitChunks: {
        cacheGroups: {
          peerDependencies: {
            test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    }
  ),
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
              hmr: !useProductionBuild,
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
              plugins: [
                AutoPrefixerPlugin,
                CSSNanoPlugin,
              ],
              sourceMap: true,
              modules: true,
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

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    new HtmlWebpackPlugin({
      template: './demo/index.template.html',
    }),
  ],
};
