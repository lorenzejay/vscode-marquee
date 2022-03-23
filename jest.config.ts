import type { Config } from '@jest/types';
import { jsWithTsESM as tsjPreset } from 'ts-jest/presets';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/tests/**/*.test.(ts|tsx)'
  ],
  transform: {
    ...tsjPreset.transform,
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules'
  },
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/src/**/*.(js|ts|tsx)',
    '!packages/**/src/**/*.d.ts'
  ],
  "coveragePathIgnorePatterns": [
    'packages/utils/src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 52,
      functions: 58,
      lines: 74,
      statements: 73
    }
  },
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  bail: false
};

export default config;
