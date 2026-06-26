import "@testing-library/jest-dom";

import { CART_QUERY_KEY } from "@/hooks/feature/query/useCartQuery";
import { ORDER_QUERY_KEY } from "@/hooks/feature/query/useOrderQuery";
import { queryStore } from "@/service/queries/instance";
import { resetOrder, seedCarts, server } from "@/tests/setup/server";

// MSW 수명주기: 처리되지 않은 요청은 오류로 처리해 누락을 빠르게 드러낸다.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  // 1) 서버 상태를 기본 장바구니로 초기화하고 주문 상태도 리셋
  seedCarts();
  resetOrder();
  // 2) queryStore 는 싱글톤이라 테스트 간 캐시/에러가 누수된다 → 무효화
  queryStore.invalidate(CART_QUERY_KEY);
  queryStore.invalidate(ORDER_QUERY_KEY);
  // 3) 선택 상태 persist 용 localStorage 초기화
  localStorage.clear();
});
