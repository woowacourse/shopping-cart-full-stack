/**
 * Jest 전용 Babel 플러그인.
 *
 * Vite 의 `import.meta.env` 는 Jest(Babel/Node) 환경에서 SyntaxError 를 유발한다.
 * 테스트에서는 `import.meta` 를 정적 스텁 객체로 치환해 `import.meta.env.DEV` 등이
 * 동작하도록 한다. (이 플러그인은 jest.config.cjs 에서만 참조되므로 Vite 빌드에는 영향이 없다.)
 *
 * 예) src/apis/instance.ts 의 `import.meta.env.VITE_USE_MOCK === "true" ? "/api" : "production url"`
 *     → VITE_USE_MOCK === "true" 가 되어 baseUrl 이 "/api" 로 고정되고 MSW 가 정상 가로챈다.
 */
module.exports = function importMetaEnvStub({ types: t }) {
  const buildEnv = () =>
    t.objectExpression([
      t.objectProperty(t.identifier("DEV"), t.booleanLiteral(true)),
      t.objectProperty(t.identifier("PROD"), t.booleanLiteral(false)),
      t.objectProperty(t.identifier("SSR"), t.booleanLiteral(false)),
      t.objectProperty(t.identifier("MODE"), t.stringLiteral("test")),
      t.objectProperty(t.identifier("BASE_URL"), t.stringLiteral("/")),
      t.objectProperty(t.identifier("VITE_USE_MOCK"), t.stringLiteral("true")),
    ]);

  return {
    name: "import-meta-env-stub",
    visitor: {
      MetaProperty(path) {
        // `import.meta` → `{ env: { DEV: true, ... }, url: "" }`
        path.replaceWith(
          t.objectExpression([
            t.objectProperty(t.identifier("env"), buildEnv()),
            t.objectProperty(t.identifier("url"), t.stringLiteral("")),
          ]),
        );
      },
    },
  };
};
