import { Route, Routes } from "react-router-dom";
import "./App.css";
import CartPage from "./pages/CartPage/CartPage";

import { CartProvider } from "./pages/CartPage/CartContext";
import { CartSelectionProvider } from "./pages/CartPage/CartSelectionContext";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import OrderCompletePage from "./pages/OrderCompletePage/OrderCompletePage";

function App() {
  return (
    <Routes>
      <Route
        path="cart"
        element={
          <CartProvider cartId={1}>
            <CartSelectionProvider>
              <CartPage />
            </CartSelectionProvider>
          </CartProvider>
        }
      />
      <Route path="checkout/:checkoutId" element={<CheckoutPage />} />
      <Route path="order-complete" element={<OrderCompletePage />} />
    </Routes>
  );
}

export default App;
