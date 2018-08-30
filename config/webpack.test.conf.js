const config = require('./webpack.base.conf.js');
const webpack = require('webpack');
const path = require('path');

config.externals = {};

config.plugins.push(
  new webpack.SourceMapDevToolPlugin({
    filename: null, // if no value is provided the sourcemap is inlined
    test: /\.(ts|tsx)($|\?)/i // process .js and .ts files only
  })
);

config.module.rules.push({
  enforce: 'post',
  test: /\.(ts|tsx)$/,
  loader: 'istanbul-instrumenter-loader',
  include: path.resolve('src/'),
  exclude: /\.test\.(ts|tsx)$/,
});

module.exports = config;
