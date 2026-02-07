import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
};

export default config;
