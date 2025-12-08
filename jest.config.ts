const { createDefaultPreset } = require("ts-jest");
import type {Config} from 'jest';
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
const config: Config = {
  testEnvironment: "node",
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!marked|cli-table3)/"
  ],
  globalSetup: './test/jest.global-setup.ts',
  globalTeardown: './test/jest.global-teardown.ts',
};

module.exports = config;