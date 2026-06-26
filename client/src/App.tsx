import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { ROUTES } from "@constants/routes";
import CartsPage from "@pages/CartsPage";
import OrderConfirmPage from "@pages/OrderConfirmPage";
import { ModalProvider } from "@/service/modal";
import PaymentConfirmPage from "@pages/PaymentConfirmPage";

function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.CARTS} replace />} />
          <Route path={ROUTES.CARTS} element={<CartsPage />} />
          <Route path={ROUTES.ORDER_CONFIRM} element={<OrderConfirmPage />} />
          <Route path={ROUTES.PAYMENT} element={<PaymentConfirmPage />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;
