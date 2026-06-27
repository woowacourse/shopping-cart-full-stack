const path = require("node:path");

// babel-jest 의 transform 옵션은 babel 로 그대로 전달되며 babel 은 jest 의 <rootDir>
// 토큰을 해석하지 못한다 → 플러그인은 절대경로로 지정한다.
const importMetaEnvPlugin = path.resolve(__dirname, "babel-plugin-import-meta-env.cjs");

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",

  // jsdom 이 'browser' export 조건을 강제하면 undici/msw 가 브라우저 번들로 잡혀
  // 깨진다. 빈 조건으로 덮어써 Node(CJS) 번들로 해석되도록 한다.
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  // web 표준 전역 폴리필 → 테스트 환경 구성 → RTL/jest-dom/MSW 수명주기 순으로 로드된다.
  setupFiles: ["<rootDir>/jest.polyfills.cjs"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs", "json", "node"],

  moduleNameMapper: {
    // 정적 에셋 / 스타일은 stub 으로 (alias 매핑보다 먼저 평가되어야 한다)
    "\\.(svg|png|jpe?g|gif|webp|avif)$": "<rootDir>/__mocks__/fileMock.cjs",
    "\\.(css|scss|sass|less)$": "<rootDir>/__mocks__/styleMock.cjs",

    // vite/tsconfig 경로 alias
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@apis/(.*)$": "<rootDir>/src/apis/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@contexts/(.*)$": "<rootDir>/src/contexts/$1",
  },

  transform: {
    // .mjs 도 포함: msw 의 ESM 전용 의존성을 babel 로 CJS 변환한다.
    "^.+\\.(jsx?|tsx?|mjs)$": [
      "babel-jest",
      {
        babelrc: false,
        configFile: false,
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
        plugins: [importMetaEnvPlugin],
      },
    ],
  },

  // msw v2 및 ESM 전용 의존성은 node_modules 이지만 변환 대상에 포함시킨다.
  transformIgnorePatterns: [
    "/node_modules/(?!(" +
      [
        "msw",
        "@mswjs",
        "@open-draft",
        "@bundled-es-modules",
        "until-async",
        "rettime",
        "headers-polyfill",
        "strict-event-emitter",
        "is-node-process",
        "outvariant",
      ].join("|") +
      ")/)",
  ],

  testMatch: ["<rootDir>/src/**/*.(test|spec).(ts|tsx)"],

  clearMocks: true,
};
