import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import functional from "eslint-plugin-functional";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      functional,
    },
    rules: {
      // 변수 선언 시 const만 허용
      "no-var": "error",
      "prefer-const": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclaration[kind='let']",
          message: "let 대신 const를 사용하세요.",
        },
        {
          selector: "IfStatement[alternate]",
          message: "else를 사용하지 말고 early return을 사용하세요.",
        },
      ],

      // 함수/제어문 복잡도 제한
      "max-depth": ["error", 1],
      "max-params": ["error", 2],
      "max-lines-per-function": [
        "error",
        {
          max: 10,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // 문법 제한
      "no-ternary": "error",
      "no-else-return": "error",

      // 축약 이름 제한 예시
      "id-denylist": ["error", "req", "res", "ctx", "err", "msg", "num", "str", "obj", "arr"],

      // 클래스 멤버 접근제어 명시
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
          overrides: {
            constructors: "no-public",
          },
        },
      ],

      // 파라미터 재할당 금지
      "no-param-reassign": "error",
    },
  },

  // domain 계층은 더 순수하게 강제
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "functional/no-let": "error",
      "functional/immutable-data": "error",
      "functional/no-expression-statements": "error",
    },
  },

  // HTTP layer가 domain을 호출하는 것은 허용하되,
  // domain이 HTTP/Express를 import하지 못하게 막기
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["express", "../controllers/*", "../routes/*", "../http/*"],
              message: "domain 계층에서는 HTTP/Express 계층을 import하지 마세요.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/middlewares/**/*.ts"],
    rules: {
      "max-params": "off",
      "max-lines-per-function": "off",
    },
  },

  {
    ignores: ["dist", "node_modules"],
  },
);
