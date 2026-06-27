// App.tsx
import { Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { Header } from "./shared/components/Header";
import { CartPage } from "./features/cart/pages/CartPage";
import { CheckoutPage } from "./features/checkout/pages/CheckoutPage";
import { PaymentConfirmPage } from "./features/checkout/pages/PaymentConfirmPage";

function App() {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-confirm" element={<PaymentConfirmPage />} />
      </Routes>
    </>
  );
}

export default App;
