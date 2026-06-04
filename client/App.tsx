import { Routes, Route, Navigate } from "react-router-dom";

import ShoppingCartPage from "./src/components/pages/ShoppingCartPage";
import OrderConfirmPage from "./src/components/pages/OrderConfirmPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cart" replace />} />;
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/order-confirm" element={<OrderConfirmPage />} />{" "}
    </Routes>
  );
}

export default App;
