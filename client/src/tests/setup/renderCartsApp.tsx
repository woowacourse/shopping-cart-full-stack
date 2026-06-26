import { ModalProvider } from "@/service/modal";
import { ROUTES } from "@constants/routes";
import CartsPage from "@pages/CartsPage";
import OrderConfirmPage from "@pages/OrderConfirmPage";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";

/**
 * App.tsx 의 Provider/라우팅을 MemoryRouter 위에서 그대로 재현한다.
 * "주문 확인" 클릭 → /order-confirm 이동이 실제 앱과 동일하게 동작하므로
 * CartsSection ↔ OrderConfirmSection 을 잇는 통합 흐름을 검증할 수 있다.
 * (쿠폰 모달 등은 ModalProvider 컨텍스트가 필요하므로 App.tsx 와 동일하게 감싼다.)
 */
export function renderCartsApp(initialPath: string = ROUTES.CARTS) {
  const user = userEvent.setup();

  const result = render(
    <ModalProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.CARTS} replace />} />
          <Route path={ROUTES.CARTS} element={<CartsPage />} />
          <Route path={ROUTES.ORDER_CONFIRM} element={<OrderConfirmPage />} />
        </Routes>
      </MemoryRouter>
    </ModalProvider>,
  );

  return { user, ...result };
}
