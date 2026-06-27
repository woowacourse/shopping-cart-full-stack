import "@testing-library/jest-dom";

import { queryStore } from "@/queries/instance";
import { server } from "@/mocks/server";
import { seedCarts } from "@/mocks/datas/carts";

// JSDOM does not support HTMLDialogElement's showModal and close methods.
if (typeof HTMLDialogElement === "function") {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

// Polyfill for ESC key closing behavior for <dialog>
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openDialogs = document.querySelectorAll<HTMLDialogElement>("dialog[open]");
      openDialogs.forEach((dialog) => {
        const cancelEvent = new Event("cancel", { cancelable: true });
        dialog.dispatchEvent(cancelEvent);
        if (!cancelEvent.defaultPrevented) {
          dialog.close();
        }
      });
    }
  });
}

// MSW 수명주기: 처리되지 않은 요청은 오류로 처리해 누락을 빠르게 드러낸다.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  // 1) 서버 상태를 기본 장바구니로 초기화
  seedCarts();
  // 2) queryStore 는 싱글톤이라 테스트 간 캐시/에러가 누수된다 → 전체 초기화
  queryStore.clear();
  // 3) 선택 상태 persist 용 localStorage 초기화
  localStorage.clear();
});
