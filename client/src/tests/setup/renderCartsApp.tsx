import { ROUTES } from "@constants/routes";
import CartsPage from "@pages/CartsPage";
import OrderCompletePage from "@pages/OrderCompletePage";
import OrderFormPage from "@pages/OrderFormPage";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { ModalProvider } from "@contexts/ModalContext.tsx";

/**
 * App.tsx 의 라우팅을 MemoryRouter 위에서 그대로 재현한다.
 * "주문 확인" 클릭 → /order-confirm 이동이 실제 앱과 동일하게 동작하므로
 * CartsSection ↔ OrderConfirmSection 을 잇는 통합 흐름을 검증할 수 있다.
 */
export function renderCartsApp(initialEntry: any = ROUTES.CARTS) {
  const user = userEvent.setup();

  const result = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.CARTS} replace />} />
          <Route path={ROUTES.CARTS} element={<CartsPage />} />
          <Route path={ROUTES.ORDER_FORM} element={<OrderFormPage />} />
          <Route path={ROUTES.ORDER_COMPLETE} element={<OrderCompletePage />} />
        </Routes>
      </ModalProvider>
    </MemoryRouter>,
  );

  return { user, ...result };
}
