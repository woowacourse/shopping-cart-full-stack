import { Routes, Route, Navigate } from "react-router-dom";
import { OrderCheckPage } from "./CheckoutPage/OrderCheckPage";
import { PaymentConfirmPage } from "./PaymentConfirmPage/PaymentConfirmPage";
import { CartPage } from "./CartPage/CartPage";

function App() {
  return (
    <Routes>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout/:orderId" element={<OrderCheckPage />} />
      <Route path="/payment/confirm" element={<PaymentConfirmPage />} />
      <Route path="*" element={<Navigate to="/cart" replace />} />
    </Routes>
  );
}

export default App;
