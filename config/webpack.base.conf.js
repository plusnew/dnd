const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = WebpackPlugin = require("clean-webpack-plugin")
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
  entry: ['./index.tsx'],
  mode: 'development',
  output: {
      path: __dirname + '/../dist',
      filename: 'app.js',
      library: 'plusnewDnd',
      libraryTarget: "umd",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new TsConfigPathsPlugin()],
  },
  context: path.resolve(__dirname, '..', 'src'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
        root: path.join(__dirname, '..', 'dist'),
      }
    ),
    new CopyWebpackPlugin([
      {
        from: '**/*.d.ts',
      }
    ])
  ],
  externals: [
    function (context, request, callback) {
      const contextParts = path.parse(context);
      if (request === 'plusnew' || (request === 'enzyme' && contextParts.base !== 'karma')) {
        return callback(null, request);
      } else if (request === '__dirname') { // This module creates a string for each module, in what directory it is existent
        // const dirname = context.slice(path.resolve(__dirname, '../../src').length + 1);

        const lastDir = path.parse(context).name;
        return callback(null, JSON.stringify({ default: lastDir }));
      }
      callback();
    },
  ],
};
