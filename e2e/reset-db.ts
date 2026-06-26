import { execSync } from "node:child_process";

const DATABASE_URL = process.env.E2E_DATABASE_URL ?? "postgres://shopping:shopping@localhost:5433/shopping_cart_test";

// server의 reset 스크립트로 테스트 DB를 초기화+seed한다(스키마 force sync + 기본 데이터).
export function resetDb(): void {
  execSync("npx tsx src/db/reset.ts", {
    cwd: new URL("../server", import.meta.url).pathname,
    env: { ...process.env, DATABASE_URL },
    stdio: "ignore",
  });
}
