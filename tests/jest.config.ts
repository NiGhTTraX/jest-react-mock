import { createDefaultPreset, type JestConfigWithTsJest } from "ts-jest";

const preset = createDefaultPreset();

const config: JestConfigWithTsJest = {
  ...preset,
  testEnvironment: "jsdom",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "<rootDir>/tests/results",
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      lines: 100,
      branches: 100,
    },
  },
};

export default config;
