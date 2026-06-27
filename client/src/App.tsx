import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import CartsPage from "@pages/CartsPage";
import OrderCompletePage from "@pages/OrderCompletePage";
import OrderFormPage from "@pages/OrderFormPage";
import { ROUTES } from "@constants/routes";
import { ModalProvider } from "@contexts/ModalContext";

function App() {
  return (
    <BrowserRouter basename="/shopping-cart-full-stack">
      <ModalProvider>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.CARTS} replace />} />
          <Route path={ROUTES.CARTS} element={<CartsPage />} />
          <Route path={ROUTES.ORDER_FORM} element={<OrderFormPage />} />
          <Route path={ROUTES.ORDER_COMPLETE} element={<OrderCompletePage />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
