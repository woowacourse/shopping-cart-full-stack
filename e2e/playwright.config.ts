import { defineConfig, devices } from "@playwright/test";

// server CORS가 localhost:5173만 허용하므로 preview도 5173에서 띄운다.
const CLIENT_PORT = 5173;
const SERVER_PORT = 3000;

// e2e는 client production build(msw 비활성)가 실제 server를 호출하고,
// server는 docker-compose의 테스트 PostgreSQL(5433)에 연결한다.
const SERVER_DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? "postgres://shopping:shopping@localhost:5433/shopping_cart_test";

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${CLIENT_PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      // server: 테스트 DB에 연결해 기동. 스키마 sync + seed는 initDatabase가 수행한다.
      command: "npm run dev --prefix ../server",
      port: SERVER_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { DATABASE_URL: SERVER_DATABASE_URL, PORT: String(SERVER_PORT) },
    },
    {
      // client: production build(msw off) + preview. build 시점에 API base를 server로 주입한다.
      command: `npm run build --prefix ../client && npm run preview --prefix ../client -- --port ${CLIENT_PORT} --strictPort`,
      port: CLIENT_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { VITE_API_BASE_URL: `http://localhost:${SERVER_PORT}` },
    },
  ],
});
