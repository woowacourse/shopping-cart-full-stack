import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@errors/(.*)$": "<rootDir>/src/errors/$1",
    "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: false },
          target: "es2022",
        },
        module: { type: "commonjs" },
      },
    ],
  },
  testMatch: ["<rootDir>/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts", "!src/index.ts"],
};

export default config;
