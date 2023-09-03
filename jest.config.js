/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  silent: false,
}
