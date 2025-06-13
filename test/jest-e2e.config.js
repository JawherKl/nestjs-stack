module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest-e2e.setup.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  }
};