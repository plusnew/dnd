const config = require('./webpack.base.conf.js');

module.exports = {
  ...config,
  mode: "development",
  devServer: {
    port: 3000,
    clientLogLevel: "info",
  }
}