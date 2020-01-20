module.exports = {
  verbose: true,
  rootDir: __dirname,
  roots: [
    "<rootDir>/src",
  ],
  modulePaths: ["src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ['tsx', 'ts', 'js'],
  setupFiles: [],
  coverageReporters: [
    "lcov",
    "text"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
}