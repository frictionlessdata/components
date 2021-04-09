const jestConfig = {
  preset: 'ts-jest',
  displayName: 'jsdom',
  testMatch: ['**/test/**/*.ts(x)'],
  testPathIgnorePatterns: ['/node_modules/', 'setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 10000,
  collectCoverage: false,
  coverageReporters: ['text-summary', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      statements: 40,
      lines: 40,
    },
  },
}

module.exports = jestConfig
