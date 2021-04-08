const jestConfig = {
  roots: ['src'],
  preset: 'ts-jest',
  displayName: 'jsdom',
  testEnvironment: 'jsdom',
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
