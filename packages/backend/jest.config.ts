import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '^~/(.*)$': '<rootDir>/src/$1',
    '^~/storage/(.*)$': '<rootDir>/src/layers/storage/$1',
    '^~/api/(.*)$': '<rootDir>/src/layers/api/$1',
    '^~/functionality/(.*)$': '<rootDir>/src/layers/functionality/$1',
    '^~/integration/(.*)$': '<rootDir>/src/layers/integration/$1',
    '^~/common/(.*)$': '<rootDir>/src/common/$1',
  },
  setupFilesAfterEnv: ['tsconfig-paths/register'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageReporters: ['text', 'lcov', 'cobertura'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/app.module.ts',
    '<rootDir>/src/common/api/setup-versioning.ts',
    '<rootDir>/src/common/pipes',
    '<rootDir>/src/configs/',
    '<rootDir>/src/database/migrations/',
    '<rootDir>/src/docs/',
    '<rootDir>/src/layers/api/api.module.ts',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/test-utils/',
    '<rootDir>/src/typeorm-cli.config.ts',
    '<rootDir>/test',
  ],
  testEnvironment: 'node',
};

export default jestConfig;
