/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const fs = require('fs');
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const packageJson = require('./package.json');

const dynamicallyGeneratedRules = fs
  .readdirSync(
    path.resolve(__dirname, './node_modules/highlight.js/lib/languages')
  )
  .reduce((acc, fileName) => {
    const lang = fileName.split('.')[0];
    return [
      ...acc,
      {
        test: /highlight\.js\/lib\/index\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: `hljs.registerLanguage('${lang}', require('./languages/${lang}'));`,
          replace: '',
        },
      },
    ];
  }, []);

module.exports = {
  target: 'node',
  mode: 'production',
  devtool: false,
  entry: {
    [`${packageJson.scriptOutputName}`]: './src/main.ts',
  },
  externals: [
    '@google-cloud/spanner',
    '@sap/hana-client',
    '@sap/hana-client/extension/Stream',
    'better-sqlite3',
    'hdb-pool',
    'ioredis',
    'mongodb',
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'pg-native',
    'pg-query-stream',
    'pg',
    'react-native-sqlite-storage',
    'redis',
    'sqlite3',
    'typeorm-aurora-data-api-driver',
  ],
  output: {
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './node_modules/sql.js/dist/sql-wasm.wasm' }],
    }),
  ],
  module: {
    noParse: /node_modules\/sql\.js\/dist\/sql-wasm\.js$/,
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
      },
      ...dynamicallyGeneratedRules,
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: /main/,
          mangle: false,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
