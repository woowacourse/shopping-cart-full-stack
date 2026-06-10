import type {Config} from 'jest';

const config: Config = {
  testEnvironment: '<rootDir>/testEnvironment.cjs',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '\\.(gif|jpg|jpeg|png|svg|webp)$': '<rootDir>/src/test/fileMock.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(mjs|cjs|jsx?|tsx?)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
          target: 'es2022',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@mswjs|@open-draft|msw|rettime|until-async)/)'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
