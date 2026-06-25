import { Routes, Route, Navigate } from "react-router-dom";

import ShoppingCartPage from "./src/components/pages/ShoppingCartPage";
import OrderConfirmPage from "./src/components/pages/OrderConfirmPage";
import PayConfirmPage from "./src/components/pages/PayConfirmPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cart" replace />} />;
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/order/:orderId" element={<OrderConfirmPage />} />
      <Route path="/payment" element={<PayConfirmPage />} />
    </Routes>
  );
}

export default App;
