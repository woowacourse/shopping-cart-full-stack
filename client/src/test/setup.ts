import "@testing-library/jest-dom";
import { beforeEach, afterEach, afterAll, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { createHandlers } from "../msw/handlers";

// jsdom이 opaque origin으로 뜨면 window.localStorage가 비활성(undefined)이 된다.
// 테스트에서 선택 상태 영속을 검증하므로, 없을 때만 동작하는 in-memory Storage를 주입한다.
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  const memoryStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => void store.delete(key),
    setItem: (key, value) => void store.set(key, String(value)),
  };
  Object.defineProperty(globalThis, "localStorage", { value: memoryStorage, configurable: true });
}

export const server = setupServer(...createHandlers());

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

beforeEach(() => {
  server.resetHandlers(...createHandlers());
  localStorage.removeItem("cart_selection");
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
