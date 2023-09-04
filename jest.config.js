/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
    '^.+\\.[tj]sx?$': ['ts-jest', { isolatedModules: true }],
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  silent: false,
}
