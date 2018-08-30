var webpackConfig = require("./webpack.test.conf.js");
var path = require('path');

module.exports = function karmaConfig(config) {

  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../dist/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      require.resolve('plusnew'),
      '../configs/karma/globalEnzyme.ts',
      '../src/**/*.test.tsx',
      '../src/**/*.test.ts',
      { pattern: '**/*', watched: true, included: false, served: true, nocache: false }
    ],

    // webpack: webpackConfig,

    // list of files to exclude
    exclude: [],

    // // preprocess matching files before serving them to the browser
    // // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors:
      {
        '../configs/karma/globalEnzyme.ts': ['webpack'],
        '../src/**/*.test.tsx': ['webpack', 'sourcemap'],
        '../src/**/*.test.ts': ['webpack', 'sourcemap'],
      },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      reports: ['html', 'lcov', 'text-summary'],
      dir: path.join(__dirname, '..', 'coverage'),
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
      'karma-chrome-launcher',
    ],

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    webpack: webpackConfig,
  };

  config.set(configuration);
};
